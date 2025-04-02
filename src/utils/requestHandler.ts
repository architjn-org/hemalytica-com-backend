import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import { CustomError, InternalError } from './errors'
import logger from './logger'

export type RequestContext = {
  accountId: string
}

type HandlerFunction = (event: APIGatewayProxyEvent, ctx?: RequestContext) => Promise<any>
type schemaKey = 'body' | 'path' | 'query'

const extractToken = async (event: APIGatewayProxyEvent): Promise<RequestContext | undefined> => {
  const token = event.headers.Authorization || event.headers.authorization
  if (token) {
    try {
      const secret = process.env.JWT_SECRET
      if (!secret) {
        throw new InternalError('JWT_SECRET is not defined')
      }
      const decoded: any = jwt.verify(token, secret)
      return { accountId: decoded.accountId }
    } catch (error) {
      return undefined
    }
  }
  return undefined
}

const validateRequest = (schema: { [key: string]: Joi.ObjectSchema }, event: APIGatewayProxyEvent) => {
  if (schema.body) {
    const { error } = schema.body.validate(event.body ? JSON.parse(event.body) : null)
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
      }
    }
  }
  if (schema.path) {
    const { error } = schema.param.validate(event.pathParameters)
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
      }
    }
  }
  if (schema.query) {
    const { error } = schema.query.validate(event.queryStringParameters)
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
      }
    }
  }
  return null
}

export const withRequestHandler = (
  handler: HandlerFunction,
  schema?: Partial<{ [key in schemaKey]: Joi.ObjectSchema }>,
  isSecure: boolean = true,
) => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let ctx: RequestContext | undefined = undefined

    try {
      if (isSecure) {
        ctx = await extractToken(event)
        if (!ctx?.accountId) {
          return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized: Invalid token' }),
          }
        }
      }

      const validationErrorResponse = validateRequest(schema || {}, event)
      if (validationErrorResponse) {
        return validationErrorResponse
      }

      // Execute the main handler function
      const result = await handler(event, ctx)
      if (result === true) {
        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Success' }),
        }
      }
      // Return success response
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: result,
        }),
      }
    } catch (error: any) {
      logger.error('Error occurred:', { error, event, ctx })

      const { statusCode, errorMessage } = handleCustomError(error)

      return {
        statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: errorMessage,
        }),
      }
    }
  }
}

const handleCustomError = (error: any) => {
  let statusCode = 500
  let errorMessage = 'An unexpected error occurred.'

  if (error instanceof CustomError) {
    statusCode = error.statusCode
    errorMessage = error.message
  }

  return {
    statusCode,
    errorMessage,
  }
}
