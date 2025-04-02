import { APIGatewayProxyEvent } from 'aws-lambda'
import Joi from 'joi'
import { addToWaitlist } from '../services/waitlistService'
import { ValidationError } from '../utils/errors'
import logger from '../utils/logger'
import { RequestContext, withRequestHandler } from '../utils/requestHandler'

const mainHandler = async (event: APIGatewayProxyEvent, ctx?: RequestContext) => {
  logger.info('Received request to add to waitlist', { event, ctx })

  const waitlistData = event.body ? JSON.parse(event.body) : null
  if (!waitlistData || !waitlistData.email) {
    throw new ValidationError('Email is required')
  }

  await addToWaitlist({ email: waitlistData.email })
  return true
}

const inputSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
}

export const handler = withRequestHandler(mainHandler, inputSchema, false)
