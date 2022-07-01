import { NextFunction, Request, Response } from 'express'

export interface JsonResponse<T> extends Response {
  jsonSuccess: (data: T) => void
  jsonError: (message: string, code: string | number) => void
}

export interface JsonResponseData<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string | number
  }
}

function jsonResponseMiddleware<T>(
  _request: Request,
  response: Response,
  next: NextFunction
): void {
  try {
    const resp = response as JsonResponse<T>
    resp.jsonSuccess = (data: T): void => {
      const ret: JsonResponseData<T> = {
        success: true,
        data,
      }
      response.json(ret)
    }
    resp.jsonError = (message: string, code: string | number): void => {
      const ret: JsonResponseData<T> = {
        success: false,
        error: {
          message,
          code,
        },
      }
      response.json(ret)
    }
    next()
  } catch (error) {
    next(error)
  }
}

export default jsonResponseMiddleware
