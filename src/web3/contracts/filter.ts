import filterABI from './filterABI.json'
import { ethers } from 'ethers'
import WrappedContract from './base'

export default class FilterContract extends WrappedContract {
  constructor(
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    super(filterABI, address, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }
}
