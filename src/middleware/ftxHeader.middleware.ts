import { NextFunction, Request, Response } from 'express'

function ftxHeaderMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  let headers: any
  if (request.header('FTX-KEY')) {
    if (!headers) headers = {}
    headers['FTX-KEY'] = request.header('FTX-KEY')
  }
  if (request.header('FTX-TS')) {
    if (!headers) headers = {}
    headers['FTX-TS'] = request.header('FTX-TS')
  }
  if (request.header('FTX-SIGN')) {
    if (!headers) headers = {}
    headers['FTX-SIGN'] = request.header('FTX-SIGN')
  }
  if (request.header('FTX-SUBACCOUNT')) {
    if (!headers) headers = {}
    headers['FTX-SUBACCOUNT'] = request.header('FTX-SUBACCOUNT')
  }
  ;(request as any).ftxHeader = headers
  next()
}

export interface FtxHeaderRequest extends Request {
  ftxHeader: any
}

export default ftxHeaderMiddleware
