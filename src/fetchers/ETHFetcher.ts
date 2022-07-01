import { Fetcher, FetcherChainName, ETHFetcherData } from './types'
import { ETHScanBaseFetcher } from './Fetcher'

const { FETCHER_ETH_TOKENS, FETCHER_ETH_URL } = process.env

// eslint-disable-next-line prettier/prettier
export class ETHBaseFetcher extends ETHScanBaseFetcher implements Fetcher<ETHFetcherData> {
  public chainName!: FetcherChainName

  public async getDataOfAddress(address: string): Promise<ETHFetcherData> {
    const normalTxList = await this.txlist({
      address,
      startblock: '0',
      endblock: '999999999',
      page: '1',
      offset: '9999',
      sort: 'desc',
    })
    const erc20TxList = await this.tokentx({
      address,
      startblock: '0',
      endblock: '999999999',
      page: '1',
      offset: '9999',
      sort: 'desc',
    })
    const erc721TxList = await this.tokennfttx({
      address,
      startblock: '0',
      endblock: '999999999',
      page: '1',
      offset: '9999',
      sort: 'desc',
    })
    return {
      normalTxList,
      erc20TxList,
      erc721TxList,
      count: normalTxList.length + erc20TxList.length + erc721TxList.length,
      address,
    }
  }
}

export default class ETHFetcher extends ETHBaseFetcher {
  public chainName: FetcherChainName = 'ETH'

  constructor() {
    super({
      RPCUrl: FETCHER_ETH_URL ?? 'https://api.etherscan.io',
      tokens: (
        FETCHER_ETH_TOKENS ?? '8TC7JGIKAKBF1YDSZMH2Y13U3FVEX9ZGFJ'
      ).split(','),
    })
  }
}
