import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  DataType,
  Default,
} from 'sequelize-typescript'

type InQueueLogState = 'created' | 'waiting' | 'pending' | 'resolved' | 'rejected' | 'error'

export interface InQueueLogRawData {
  blockNumber: number,
  data: string,
  transactionHash: string,
  user: string,
  amount: number,
  index: number,
}

export interface InQueueLogDBData extends InQueueLogRawData {
  id: number
  state: InQueueLogState,
  errorMessage: string | null
}

@Table({
  modelName: 'inQueueLog',
})
export default class InQueueLog extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get blockNumber(): number {
    return this.getDataValue('blockNumber')
  }

  @AllowNull(false)
  @Column(DataType.TEXT)
  get data(): string {
    return this.getDataValue('data')
  }

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  get transactionHash(): string {
    return this.getDataValue('transactionHash')
  }

  @AllowNull(false)
  @Column(DataType.STRING)
  get user(): string {
    return this.getDataValue('user')
  }

  @AllowNull(false)
  @Column(DataType.INTEGER)
  get amount(): number {
    return this.getDataValue('amount')
  }

  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get index(): number {
    return this.getDataValue('index')
  }

  @AllowNull(false)
  @Default('created')
  @Column(DataType.ENUM('created', 'waiting', 'pending', 'resolved', 'rejected', 'error'))
  get state(): InQueueLogState {
    return this.getDataValue('state')
  }

  @Column(DataType.TEXT)
  get errorMessage(): string | null {
    return this.getDataValue('errorMessage')
  }

  getData(): InQueueLogDBData {
    const r: InQueueLogDBData = {
      id: this.id,
      blockNumber: this.blockNumber,
      data: this.data,
      transactionHash: this.transactionHash,
      user: this.user,
      amount: this.amount,
      index: this.index,
      state: this.state,
      errorMessage: this.errorMessage,
    }
    return r
  }

  getRawData(): InQueueLogRawData {
    const r: InQueueLogRawData = {
      blockNumber: this.blockNumber,
      data: this.data,
      transactionHash: this.transactionHash,
      user: this.user,
      amount: this.amount,
      index: this.index,
    }
    return r
  }

  static async findOrCreatePyTransactionHash(
    transactionHash: string,
    defaultValue: InQueueLogRawData,
  ): Promise<[InQueueLog, boolean]> {
    return await InQueueLog.findOrCreate({
      where: { transactionHash },
      defaults: defaultValue as any,
    })
  }
}
