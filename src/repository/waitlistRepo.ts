import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { put, scan } from './dynamoDbRepo'

interface WaitlistEntry {
  userId: string
  email: string
  status: string
  createdOn: string
}

// Function to find if an email already exists in the waitlist
export const findWaitlistEntryByEmail = async (email: string): Promise<WaitlistEntry[]> => {
  const filterExpression = 'email = :emailVal'
  const expressionAttributeValues = {
    ':emailVal': email,
  }
  // Assuming WAITLIST_TABLE is set in environment variables
  const tableName = process.env.WAITLIST_TABLE as string

  const results = await scan(tableName, filterExpression, expressionAttributeValues)
  return results as WaitlistEntry[]
}

export const addToWaitlist = async (data: { email: string }): Promise<void> => {
  const entry: WaitlistEntry = {
    userId: uuidv4(),
    email: data.email,
    status: 'PENDING',
    createdOn: moment().utc().toISOString(),
  }

  await put(process.env.WAITLIST_TABLE as string, entry)
}
