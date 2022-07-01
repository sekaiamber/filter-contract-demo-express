import erc721MockABI from './erc721MockABI.json'
import { BigNumber, ethers } from 'ethers'
import Decimal from 'decimal.js'
import WrappedContract from './base'

export default class Erc721MockContract extends WrappedContract {
  constructor(
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    super(erc721MockABI, address, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }

  async getPrice(): Promise<string> {
    const contract = this.getInstance()
    const price: BigNumber = await contract.getPrice()
    return price.toString()
  }

  async mint(amount = 1, txOptions = {}): Promise<ethers.ContractReceipt> {
    const price = await this.getPrice()
    const value = new Decimal(price).mul(amount).toString()
    const contract = this.getInstance()
    const status = await contract.mint(amount, {
      // gasPrice: ethers.utils.parseUnits('1', 'gwei'),
      gasLimit: 800000,
      value,
      ...txOptions,
    })
    const tx = await status.wait()
    return tx
  }

  async balanceOf(address: string): Promise<BigNumber> {
    const contract = this.getInstance()
    const bn = await contract.balanceOf(address)
    return bn
  }
}
