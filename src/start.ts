import App from '.'
import {
  PingpongController,
  UtilsController,
  TxController,
  FilterController,
} from './controllers'

const app = new App([
  new PingpongController(),
  new UtilsController(),
  new TxController(),
  new FilterController(),
])
app
  .initialize()
  .then(() => {
    app.listen()
  })
  .catch((e) => console.log(e))
