import { Sequelize } from 'sequelize-typescript'
import * as Models from './models'

const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env
const { Constant } = Models

const sequelize = new Sequelize({
  host: DB_HOST,
  database: DB_NAME,
  dialect: 'mariadb',
  username: DB_USER,
  password: DB_PASS,
  dialectOptions: {
    timezone: 'Etc/GMT0',
  },
  logging: false,
  models: [Constant],
})

export default sequelize

export { Models }
