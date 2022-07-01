import HttpException from './HttpException'

class NotFoundException extends HttpException {
  constructor(id: string = 'Entity') {
    super(404, `${id} not found`)
  }
}

export default NotFoundException
