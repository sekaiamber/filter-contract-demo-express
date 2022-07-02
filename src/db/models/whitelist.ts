import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  DataType,
  Default,
} from 'sequelize-typescript'

export interface WhitelistDBData {
  id: number
  address: string
  amount: number
}

@Table({
  modelName: 'whitelist',
})
export default class Whitelist extends Model {
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  get amount(): number {
    return this.getDataValue('amount')
  }

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  get address(): string {
    return this.getDataValue('address')
  }

  getData(): WhitelistDBData {
    const r: WhitelistDBData = {
      id: this.id,
      address: this.address,
      amount: this.amount,
    }
    return r
  }

  static async findOrCreateByAddress(addr: string): Promise<Whitelist> {
    const address = addr.toLowerCase()
    const [ins] = await Whitelist.findOrCreate({
      where: { address },
      defaults: {
        address,
        amount: 0,
      },
    })
    return ins
  }

  static async increaseAmount(address: string, by = 1): Promise<Whitelist> {
    const ins = await Whitelist.findOrCreateByAddress(address)
    await ins.increment('amount', { by })
    await ins.reload()
    return ins
  }

  static async decreaseAmount(address: string, by = 1): Promise<Whitelist> {
    const ins = await Whitelist.findOrCreateByAddress(address)
    if (ins.amount > 1) {
      await ins.increment('amount', { by: -by })
      await ins.reload()
    }
    return ins
  }
}
