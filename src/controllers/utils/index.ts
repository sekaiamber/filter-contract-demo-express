import { Request, RequestHandler, NextFunction, Router } from 'express'
import Controller from '../../interfaces/controller.interface'
// import NotFoundException from '../../exceptions/NotFoundException'
import jsonResponseMiddleware, {
  JsonResponse,
} from '../../middleware/jsonResponse.middleware'
import axios from 'axios'
import NotFoundException from '../../exceptions/NotFoundException'

interface HtmlResponse {
  url: string
  document: string
  state: number
  baseUrl: string
}

export default class UtilsController implements Controller {
  public path = '/api/v1/utils'
  public router = Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      '/html',
      jsonResponseMiddleware,
      this.html as RequestHandler
    )
  }

  private html(
    request: Request<any, { url: string }>,
    response: JsonResponse<HtmlResponse>,
    next: NextFunction
  ): void {
    const url = request.body.url
    axios
      .get(url)
      .then((resp) => {
        response.jsonSuccess({
          url,
          document: resp.data,
          state: resp.status,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          baseUrl: `${resp.request.protocol}//${resp.request.host}`,
        })
      })
      .catch((e) => {
        next(new NotFoundException('url'))
      })
  }
}
