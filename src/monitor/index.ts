import { BigNumber, ethers, Wallet, Contract } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'
// import { BSCFetcher } from '../fetchers'
import filterAbi from '../web3/contracts/filterABI.json'
import sequelize from '../db'
import { Constant, InQueueLog } from '../db/models'
import { InQueueLogRawData, InQueueLogState } from '../db/models/inQueueLog'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export interface MonitorOption {
  interval: number
  filterContractAddress: string
  filterContractTopic: string
  filterContractDelay: number
  filterOwnerPK: string
}

enum MONITOR_DB_KEYS {
  MONITOR_LATEST_BLOCK = 'MONITOR_LATEST_BLOCK',
}

export default class Monitor {
  private readonly provider = new ethers.providers.JsonRpcProvider(
    process.env.MONITOR_PROVIDER_RPC
  )

  private readonly filterContractInterface = new ethers.utils.Interface(
    filterAbi
  )

  private readonly filterOwner: Wallet
  private readonly ownerSignedFilterContract: Contract

  constructor(readonly option: MonitorOption) {
    this.filterOwner = new Wallet(option.filterOwnerPK).connect(this.provider)
    const filterContract = new Contract(
      option.filterContractAddress,
      filterAbi
    ).connect(this.provider)
    this.ownerSignedFilterContract = filterContract.connect(this.filterOwner)
  }

  public async initialize(): Promise<void> {
    await this.connectToTheDatabase()
    await this.initConstant()
  }

  private async connectToTheDatabase(force = false): Promise<void> {
    // return await Promise.resolve()
    await sequelize.sync({ force })
  }

  private async initConstant(): Promise<void> {
    await Constant.findOrCreatePyValue(
      MONITOR_DB_KEYS.MONITOR_LATEST_BLOCK,
      parseInt(process.env.MONITOR_START_BLOCK ?? '0'),
      'parameter'
    )
  }

  listen(): void {
    this.fetch().catch((e) => console.log(e))
  }

  private async fetch(): Promise<void> {
    // 获取
    const localBlock = (await Constant.findValueByName(
      MONITOR_DB_KEYS.MONITOR_LATEST_BLOCK
    )) as unknown as number
    let latestBlock = await this.provider.getBlockNumber()
    // 因为rpc接口限制，只能小于5000的块差距
    if (latestBlock - localBlock > 4999) {
      latestBlock = localBlock + 4999
    }
    // console.log(`deal: ${localBlock} ~ ${latestBlock}`)

    try {
      const filter: ethers.providers.Filter = {
        address: this.option.filterContractAddress,
        fromBlock: localBlock,
        toBlock: latestBlock,
        topics: [this.option.filterContractTopic],
      }
      const logs = await this.queryLogs(filter)
      logs.forEach((log) => {
        this.processLog(log).catch((e) => {
          console.log(e)
        })
      })
      // 更新blocknumber
      const c = await Constant.findByName(MONITOR_DB_KEYS.MONITOR_LATEST_BLOCK)
      if (c) {
        c.setConstantValue(latestBlock)
        await c.save()
      }
    } catch (error) {
      console.log(error)
    }
    // 循环
    await sleep(this.option.interval)
    await this.fetch()
  }

  private async queryLogs(
    filter: ethers.providers.Filter
  ): Promise<InQueueLogRawData[]> {
    const logs = await this.provider.getLogs(filter)
    const ret = logs.map((log) => {
      const event = this.filterContractInterface.parseLog(log)
      const d: InQueueLogRawData = {
        blockNumber: log.blockNumber,
        data: log.data,
        transactionHash: log.transactionHash.toLocaleLowerCase(),
        user: event.args.user.toLocaleLowerCase(),
        amount: (event.args.amount as BigNumber).toNumber(),
        index: (event.args.index as BigNumber).toNumber(),
      }
      return d
    })
    return ret
  }

  private async processLog(log: InQueueLogRawData): Promise<void> {
    const [row] = await InQueueLog.findOrCreatePyTransactionHash(
      log.transactionHash,
      log
    )

    if (row.state !== 'created') return
    // 等待一段时间
    row.setDataValue('state', 'waiting')
    await row.save()
    await sleep(this.option.filterContractDelay)

    // 二次确认
    await row.reload()
    if (row.state !== 'waiting') return

    // TODO: 获取queue信息，是否还存在
    // 判定
    const passed = this.judgeLog(row)
    row.setDataValue('state', 'pending')
    await row.save()

    // 处理
    const gasPrice = await this.provider.getGasPrice()
    try {
      let status: TransactionResponse
      let state: InQueueLogState

      if (passed) {
        // call execute
        status = await this.ownerSignedFilterContract.execute(row.index, {
          gasPrice,
          gasLimit: 500000,
        })
        state = 'resolved'
      } else {
        // call revert
        status = await this.ownerSignedFilterContract.revert(row.index, {
          gasPrice,
          gasLimit: 500000,
        })
        state = 'rejected'
      }

      row.setDataValue('exTransactionHash', status.hash.toLocaleLowerCase())
      await row.save()

      const tx = await status.wait()
      row.setDataValue('exBlockNumber', tx.blockNumber)
      row.setDataValue('state', state)
    } catch (error: any) {
      let errorMessage = '/'
      if (error.receipt) {
        const receipt = error.receipt as TransactionReceipt
        row.setDataValue('exBlockNumber', receipt.blockNumber)
      }
      if (error.reason) {
        errorMessage = error.reason.toString()
      }
      row.setDataValue('errorMessage', errorMessage)
      row.setDataValue('state', 'error')
    }
    await row.save()
  }

  private judgeLog(row: InQueueLog): boolean {
    return true
  }
}
