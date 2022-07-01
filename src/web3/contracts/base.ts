import { ethers } from 'ethers'

export default class WrappedContract {
  protected ABI: {}
  protected address: string
  protected provider: ethers.Signer | ethers.providers.Provider

  constructor(
    abi: {},
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    this.ABI = abi
    this.address = address
    this.provider = provider
  }
}

export const MAX_ETH_NUM =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
