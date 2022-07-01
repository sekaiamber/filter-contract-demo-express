import App from '.'
import { PingpongController, UtilsController } from './controllers'

const app = new App([new PingpongController(), new UtilsController()])
app
  .initialize()
  .then(() => {
    app.listen()
  })
  .catch((e) => console.log(e))
