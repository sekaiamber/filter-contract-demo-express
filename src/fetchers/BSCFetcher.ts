import { FetcherChainName } from './types'
import { ETHBaseFetcher } from './ETHFetcher'

const { FETCHER_BSC_TOKENS } = process.env

export default class BSCFetcher extends ETHBaseFetcher {
  public chainName: FetcherChainName = 'BSC'

  constructor() {
    super({
      RPCUrl: process.env.FETCHER_BSC_TESTNET
        ? 'https://api-testnet.bscscan.com'
        : 'https://api.bscscan.com',
      tokens: (
        FETCHER_BSC_TOKENS ?? 'B2K11RBV9TPGUYBPWGNDTN7BQGP9GC3Q1J'
      ).split(','),
    })
  }
}
