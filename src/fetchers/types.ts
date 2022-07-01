export type FetcherChainName = 'ETH' | 'BSC'

export interface Fetcher<Data> {
  chainName: FetcherChainName
  getDataOfAddress: (address: string) => Promise<Data>
}

export interface FetcherData {
  count: number
  address: string
}

// ETH
export interface ETHScanBaseFetcherConfig {
  tokens: string[]
  RPCUrl: string
}

export interface ETHScanBaseFetcherQueryParams<T> {
  module: 'account' | 'transaction' | 'logs'
  action: 'txlist' | 'balance' | 'tokentx' | 'tokennfttx' | 'getLogs'
  args: T
}

export interface ETHScanTxlistQueryArgs {
  address: string
  startblock: string
  endblock: string
  page: string
  offset: string
  sort: 'asc' | 'desc'
}

export interface ETHScanTokentxQueryArgs {
  address: string
  startblock: string
  endblock: string
  page: string
  offset: string
  sort: 'asc' | 'desc'
}

export interface ETHScanTokennfttxQueryArgs {
  address: string
  startblock: string
  endblock: string
  page: string
  offset: string
  sort: 'asc' | 'desc'
}

export interface ETHScanGetLogsQueryArgs {
  address: string
  fromBlock: string
  toBlock: string
  topic0: string
}

export interface ETHNormalTx {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  isError: string
  txreceipt_status: string
  input: string
  contractAddress: string
  cumulativeGasUsed: string
  gasUsed: string
  confirmations: string
}

export interface ETHErc20Tx {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  from: string
  contractAddress: string
  to: string
  value: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  transactionIndex: string
  gas: string
  gasPrice: string
  gasUsed: string
  cumulativeGasUsed: string
  input: string
  confirmations: string
}

export interface ETHErc721Tx {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  from: string
  contractAddress: string
  to: string
  tokenID: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  transactionIndex: string
  gas: string
  gasPrice: string
  gasUsed: string
  cumulativeGasUsed: string
  input: string
  confirmations: string
}

export interface ETHLog {
  address: string
  topics: string[]
  data: string
  blockNumber: string
  timeStamp: string
  gasPrice: string
  gasUsed: string
  logIndex: string
  transactionHash: string
  transactionIndex: string
}

export interface ETHFetcherData extends FetcherData {
  normalTxList: ETHNormalTx[]
  erc20TxList: ETHErc20Tx[]
  erc721TxList: ETHErc721Tx[]
}
