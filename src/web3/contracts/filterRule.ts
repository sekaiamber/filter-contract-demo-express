import filterABI from './filterRuleABI.json'
import { ethers, BigNumber } from 'ethers'
import WrappedContract from './base'

export default class FilterRuleContract extends WrappedContract {
  constructor(
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    super(filterABI, address, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }

  async getMaxGasPrice(): Promise<string> {
    const contract = this.getInstance()
    const bn: BigNumber = await contract.getMaxGasPrice()
    return bn.toString()
  }
}
