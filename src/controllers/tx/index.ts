import { Request, RequestHandler, NextFunction, Router } from 'express'
import Controller from '../../interfaces/controller.interface'
import NotFoundException from '../../exceptions/NotFoundException'
import jsonResponseMiddleware, {
  JsonResponse,
} from '../../middleware/jsonResponse.middleware'
import InQueueLog, { InQueueLogDBData } from '../../db/models/inQueueLog'
import { DatabaseQueryException } from '../../exceptions/DatabaseException'

export default class TxController implements Controller {
  public path = '/api/v1/tx'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(
      '/:hash',
      jsonResponseMiddleware,
      this.get as RequestHandler
    )
  }

  private get(
    request: Request<{ hash: string }>,
    response: JsonResponse<InQueueLogDBData>,
    next: NextFunction
  ): void {
    const transactionHash = request.params.hash
    InQueueLog.findOne({
      where: { transactionHash },
    })
      .then((d) => {
        if (d) {
          response.jsonSuccess(d.getData())
        } else {
          next(new NotFoundException(transactionHash))
        }
      })
      .catch((e) => {
        next(new DatabaseQueryException())
      })
  }
}
