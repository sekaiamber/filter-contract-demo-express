import { Request, RequestHandler, NextFunction, Router } from 'express'
import Controller from '../../interfaces/controller.interface'
import jsonResponseMiddleware, {
  JsonResponse,
} from '../../middleware/jsonResponse.middleware'
import { Whitelist } from '../../db/models'
import { WhitelistDBData } from '../../db/models/whitelist'
import { DatabaseQueryException } from '../../exceptions/DatabaseException'

export default class FilterController implements Controller {
  public path = '/api/v1/filter'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(
      '/whitelist/:address',
      jsonResponseMiddleware,
      this.getWhitelist as RequestHandler
    )
    this.router.post(
      '/whitelist/:address/request',
      jsonResponseMiddleware,
      this.requestWhitelist as RequestHandler
    )
  }

  private getWhitelist(
    request: Request<{ address: string }>,
    response: JsonResponse<WhitelistDBData>,
    next: NextFunction
  ): void {
    const address = request.params.address.toLowerCase()
    Whitelist.findOrCreate({
      where: { address },
      defaults: {
        address,
        amount: 0,
      },
    })
      .then(([d]) => {
        response.jsonSuccess(d.getData())
      })
      .catch((e) => {
        next(new DatabaseQueryException())
      })
  }

  private requestWhitelist(
    request: Request<{ address: string }>,
    response: JsonResponse<WhitelistDBData>,
    next: NextFunction
  ): void {
    const address = request.params.address.toLowerCase()
    Whitelist.increaseAmount(address)
      .then((d) => {
        response.jsonSuccess(d.getData())
      })
      .catch((e) => {
        next(new DatabaseQueryException())
      })
  }
}
