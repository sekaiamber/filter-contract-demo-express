import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  DataType,
  Default,
} from 'sequelize-typescript'
import { ConstantData, ConstantKind, ConstantType } from './types'

@Table({
  modelName: 'constant',
})
export default class Constant extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  get name(): string {
    return this.getDataValue('name')
  }

  @AllowNull(false)
  @Default('parameter')
  @Column(DataType.ENUM('parameter', 'information', 'ui'))
  get kind(): ConstantKind {
    return this.getDataValue('kind')
  }

  @AllowNull(false)
  @Default('string')
  @Column(DataType.ENUM('decimal', 'string', 'boolean'))
  get type(): ConstantType {
    return this.getDataValue('type')
  }

  @Column(DataType.DECIMAL(32, 16))
  get dataDecimal(): number | null {
    return this.getDataValue('dataDecimal')
  }

  @Column(DataType.STRING(5000))
  get dataString(): string | null {
    return this.getDataValue('dataString')
  }

  @Column(DataType.BOOLEAN)
  get dataBoolean(): boolean | null {
    return this.getDataValue('dataBoolean')
  }

  @Column(DataType.STRING(50))
  get memo(): string | null {
    return this.getDataValue('memo')
  }

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  get readOnly(): boolean {
    return this.getDataValue('readOnly')
  }

  getConstantValue(): ConstantData {
    let value: string | boolean | number | null | undefined
    switch (this.type) {
      case 'decimal':
        value = this.dataDecimal
        break
      case 'string':
        value = this.dataString
        break
      case 'boolean':
        value = this.dataBoolean
        break
      default:
        break
    }
    const ret: ConstantData = {
      name: this.name,
      kind: this.kind,
      type: this.type,
      memo: this.memo,
      readOnly: this.readOnly,
      value,
    }
    return ret
  }

  setConstantValue(value: string | boolean | number | null): void {
    switch (this.type) {
      case 'decimal':
        this.setDataValue('dataDecimal', value)
        break
      case 'string':
        this.setDataValue('dataString', value)
        break
      case 'boolean':
        this.setDataValue('dataBoolean', value)
        break
      default:
        break
    }
  }

  static async findByName(name: string): Promise<Constant | null> {
    return await Constant.findOne({
      where: { name },
    })
  }

  static async findValueByName(
    name: string
  ): Promise<string | boolean | number | null | undefined> {
    const ins = await Constant.findOne({
      where: { name },
    })
    if (!ins) return null
    const v = ins.getConstantValue()
    return v.value
  }

  static async findOrCreatePyValue(
    name: string,
    defaultValue: string | boolean | number,
    kind: ConstantKind = 'parameter'
  ): Promise<[Constant, boolean]> {
    const payload: any = {
      name,
      kind,
    }
    switch (typeof defaultValue) {
      case 'number':
        payload.type = 'decimal'
        payload.dataDecimal = defaultValue
        break
      case 'string':
        payload.type = 'string'
        payload.dataString = defaultValue
        break
      case 'boolean':
        payload.type = 'boolean'
        payload.dataBoolean = defaultValue
        break
      default:
        break
    }

    return await Constant.findOrCreate({
      where: { name },
      defaults: payload,
    })
  }
}
