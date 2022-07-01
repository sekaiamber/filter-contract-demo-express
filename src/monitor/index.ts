import { ethers } from 'ethers'
// import { BSCFetcher } from '../fetchers'
import filterAbi from '../web3/contracts/filterABI.json'
import sequelize from '../db'
import { Constant } from '../db/models'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export interface MonitorOption {
  interval: number
  filterContractAddress: string
}

enum MONITOR_DB_KEYS {
  MONITOR_LATEST_BLOCK = 'MONITOR_LATEST_BLOCK',
}

export default class Monitor {
  private readonly provider = new ethers.providers.JsonRpcProvider(
    process.env.MONITOR_PROVIDER_RPC
  )

  private readonly filterInterface = new ethers.utils.Interface(filterAbi)

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
    this.deal().catch((e) => console.log(e))
  }

  private async deal(): Promise<void> {
    // 获取
    const localBlock = (await Constant.findValueByName(
      MONITOR_DB_KEYS.MONITOR_LATEST_BLOCK
    )) as unknown as number
    const latestBlock = await this.provider.getBlockNumber()

    const filter: ethers.providers.Filter = {
      address: this.option.filterContractAddress,
      fromBlock: localBlock,
      toBlock: latestBlock,
    }
    console.log(filter)
    // this.query().then().catch()
    // 循环
    await sleep(this.option.interval)
    await this.deal()
  }

  private async queryLogs(filter: ethers.providers.Filter): Promise<void> {
    // this.provider.getLogs()
  }
}
