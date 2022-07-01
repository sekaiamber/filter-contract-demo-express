import axios, { AxiosInstance } from 'axios'
import qs from 'qs'
import {
  ETHScanBaseFetcherConfig,
  ETHScanBaseFetcherQueryParams,
  ETHNormalTx,
  ETHScanTxlistQueryArgs,
  ETHScanTokentxQueryArgs,
  ETHScanGetLogsQueryArgs,
  ETHErc20Tx,
  ETHScanTokennfttxQueryArgs,
  ETHErc721Tx,
  ETHLog,
} from './types'

export default class BaseFetcher {
  protected api: AxiosInstance

  constructor(RPCUrl: string) {
    const api = axios.create({ baseURL: RPCUrl })
    this.api = api
  }
}

export class ETHScanBaseFetcher extends BaseFetcher {
  protected tokens: string[]

  constructor(config: ETHScanBaseFetcherConfig) {
    super(config.RPCUrl)
    this.tokens = config.tokens
  }

  protected getRamdomToken(): string {
    return this.tokens[Math.floor(Math.random() * this.tokens.length)]
  }

  protected getResponseData<T>(data: any): T | undefined | null {
    if (
      data.status === '1' &&
      (data.message === 'OK' || data.message.startsWith('OK'))
    ) {
      return data.result
    }
    if (data.status === '0' && data.message === 'No transactions found') {
      return data.result
    }
    return null
  }

  protected async query<R, T>(
    params: ETHScanBaseFetcherQueryParams<T>
  ): Promise<R> {
    const args = {
      module: params.module,
      action: params.action,
      apikey: this.getRamdomToken(),
      ...params.args,
    }
    const url = `/api?${qs.stringify(args)}`
    const resp = await this.api.get(url)
    const respData = resp.data
    if (!respData) throw new Error('E: Request No Data')
    const data = this.getResponseData<R>(respData)
    if (data) return data
    throw new Error(
      `E: Request succee, but fail by remote: ${respData.result as string}`
    )
  }

  public async txlist(args: ETHScanTxlistQueryArgs): Promise<ETHNormalTx[]> {
    const params: ETHScanBaseFetcherQueryParams<ETHScanTxlistQueryArgs> = {
      module: 'account',
      action: 'txlist',
      args,
    }
    const txs = await this.query<ETHNormalTx[], ETHScanTxlistQueryArgs>(params)
    return txs
  }

  public async tokentx(args: ETHScanTokentxQueryArgs): Promise<ETHErc20Tx[]> {
    const params: ETHScanBaseFetcherQueryParams<ETHScanTokentxQueryArgs> = {
      module: 'account',
      action: 'tokentx',
      args,
    }
    const txs = await this.query<ETHErc20Tx[], ETHScanTokentxQueryArgs>(params)
    return txs
  }

  public async tokennfttx(
    args: ETHScanTokennfttxQueryArgs
  ): Promise<ETHErc721Tx[]> {
    const params: ETHScanBaseFetcherQueryParams<ETHScanTokennfttxQueryArgs> = {
      module: 'account',
      action: 'tokennfttx',
      args,
    }
    const txs = await this.query<ETHErc721Tx[], ETHScanTokennfttxQueryArgs>(
      params
    )
    return txs
  }

  public async getLogs(args: ETHScanGetLogsQueryArgs): Promise<ETHLog[]> {
    const params: ETHScanBaseFetcherQueryParams<ETHScanGetLogsQueryArgs> = {
      module: 'logs',
      action: 'getLogs',
      args,
    }
    const txs = await this.query<ETHLog[], ETHScanGetLogsQueryArgs>(params)
    return txs
  }
}

// module=logs
// action=getLogs
// fromBlock=4993830
// toBlock=4993832
// address=0xe561479bebee0e606c19bb1973fc4761613e3c42
// topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
