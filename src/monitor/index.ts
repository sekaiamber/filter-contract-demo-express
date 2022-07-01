import { BigNumber, ethers } from 'ethers'
// import { BSCFetcher } from '../fetchers'
import filterAbi from '../web3/contracts/filterABI.json'
import sequelize from '../db'
import { Constant, InQueueLog } from '../db/models'
import { InQueueLogRawData } from '../db/models/inQueueLog'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export interface MonitorOption {
  interval: number
  filterContractAddress: string
  filterContractTopic: string
  filterContractDelay: number
}

enum MONITOR_DB_KEYS {
  MONITOR_LATEST_BLOCK = 'MONITOR_LATEST_BLOCK',
}

export default class Monitor {
  private readonly provider = new ethers.providers.JsonRpcProvider(
    process.env.MONITOR_PROVIDER_RPC
  )

  private readonly filterContractInterface = new ethers.utils.Interface(filterAbi)

  constructor(readonly option: MonitorOption) {}

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

    try {
      const filter: ethers.providers.Filter = {
        address: this.option.filterContractAddress,
        fromBlock: localBlock,
        toBlock: latestBlock,
        topics: [this.option.filterContractTopic],
      }
      const logs = await this.queryLogs(filter)
      logs.forEach((log) => {
        this.processLog(log)
      })
    } catch (error) {
      console.log(error)
    }
    // 循环
    await sleep(this.option.interval)
    await this.fetch()
  }

  private async queryLogs(filter: ethers.providers.Filter): Promise<InQueueLogRawData[]> {
    const logs = await this.provider.getLogs(filter)
    const ret = logs.map((log) => {
      const event = this.filterContractInterface.parseLog(log)
      const d: InQueueLogRawData = {
        blockNumber: log.blockNumber,
        data: log.data,
        transactionHash: log.transactionHash,
        user: event.args.user,
        amount: (event.args.amount as BigNumber).toNumber(),
        index: (event.args.index as BigNumber).toNumber(),
      }
      return d
    })
    return ret
  }

  private async processLog(log: InQueueLogRawData): Promise<void> {
    const [row] = await InQueueLog.findOrCreatePyTransactionHash(log.transactionHash, log)
    if (row.state !== 'created') return
    // 等待一段时间
    row.setDataValue('state', 'waiting')
    await row.save()
    await sleep(this.option.filterContractDelay)
    // 判定
    const passed = this.judgeLog(row)
    row.setDataValue('state', 'pending')
    await row.save()
    if (passed) {
      // call execute
      row.setDataValue('state', 'resolved')
      await row.save()
    } else {
      // call revert
      row.setDataValue('state', 'rejected')
      await row.save()
    }
    console.log(row.getData())
  }

  private judgeLog(row: InQueueLog): boolean {
    return true
  }
}
