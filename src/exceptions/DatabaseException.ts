import HttpException from './HttpException'

export class DatabaseException extends HttpException {
  constructor(message: string = 'database error') {
    super(500, message)
  }
}

export class DatabaseCreateException extends DatabaseException {
  constructor(id: string = 'Entity') {
    super(`${id} create fail`)
  }
}

export class DatabaseModifyException extends DatabaseException {
  constructor(id: string = 'Entity') {
    super(`${id} modify fail`)
  }
}

export class DatabaseDeleteException extends DatabaseException {
  constructor(id: string = 'Entity') {
    super(`${id} delete fail`)
  }
}

export class DatabaseQueryException extends DatabaseException {
  constructor(message: string = 'database query error') {
    super(message)
  }
}
