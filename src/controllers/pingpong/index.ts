import { Request, RequestHandler, NextFunction, Router } from 'express'
import Controller from '../../interfaces/controller.interface'
import NotFoundException from '../../exceptions/NotFoundException'
import jsonResponseMiddleware, {
  JsonResponse,
} from '../../middleware/jsonResponse.middleware'

export default class PingpongController implements Controller {
  public path = '/api/v1/pingpong'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      '/:type',
      jsonResponseMiddleware,
      this.ping as RequestHandler
    )
  }

  private ping(
    request: Request,
    response: JsonResponse<{ type: string }>,
    next: NextFunction
  ): void {
    const type = request.params.type
    if (type === 'ping') {
      response.jsonSuccess({ type })
    } else {
      next(new NotFoundException('Type'))
    }
  }
}
