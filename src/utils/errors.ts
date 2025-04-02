export class CustomError extends Error {
  public userMessage: string
  public statusCode: number

  constructor(message: string, userMessage: string, statusCode: number) {
    super(message)
    this.userMessage = userMessage
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 'Invalid input provided.', 400)
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string) {
    super(message, 'An error occurred while accessing the database.', 500)
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 'The requested resource was not found.', 404)
  }
}

export class InternalError extends CustomError {
  constructor(message: string) {
    super(message, 'An internal error occurred.', 500)
  }
}
