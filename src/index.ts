import express, { Request } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import helmet from 'helmet'
import Controller from './interfaces/controller.interface'
import errorMiddleware from './middleware/error.middleware'
import sequelize from './db'

const deleteRequestBodySaver = function (
  req: Request,
  res: any,
  buf: any,
  encoding: any
): void {
  if (buf?.length && req.method.toLocaleUpperCase() === 'DELETE') {
    try {
      const str = buf.toString(encoding || 'utf8')
      req.body = JSON.parse(str)
    } catch (error) {}
  }
}

class App {
  public app: express.Application
  public initialized: boolean = false
  public controllers: Controller[]

  constructor(controllers: Controller[]) {
    this.app = express()
    this.controllers = controllers
  }

  public listen(): void {
    this.app.listen(process.env.PORT ?? 8080, () => {
      console.log(`App listening on the port ${process.env.PORT ?? 8080}`)
    })
  }

  public async initialize(): Promise<void> {
    this.initializeConfig()
    this.initializeMiddlewares()
    this.initializeControllers()
    this.initializeErrorHandling()

    return await this.connectToTheDatabase()
  }

  private initializeConfig(): void {
    // 设置密钥
    this.app.set('jwtTokenSecret', process.env.JWT_SECRET ?? '666')
    this.app.set('jwtAdminTokenSecret', process.env.JWT_ADMIN_SECRET ?? '333')
    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'))
    this.app.set('view engine', 'ejs')
  }

  private initializeMiddlewares(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    )
    this.app.use(logger('dev'))
    this.app.use(cookieParser(process.env.COOKIE_SECRET))
    this.app.use(express.json({ verify: deleteRequestBodySaver }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(
      express.static(path.join(__dirname, '../public'), {
        setHeaders(res) {
          res.set('Access-Control-Allow-Origin', '*')
        },
      })
    )
  }

  private initializeErrorHandling(): void {
    this.app.use((_req, res) => {
      res.status(404)
      res.send('This api does not exist!')
    })
    this.app.use(errorMiddleware)
  }

  private initializeControllers(): void {
    const controllers = this.controllers
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router)
    })
  }

  private async connectToTheDatabase(force = false): Promise<any> {
    // return await Promise.resolve()
    return await sequelize.sync({ force })
  }
}

export default App
