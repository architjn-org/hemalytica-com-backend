import { put } from './dynamoDbRepo'

interface WaitlistEntry {
  email: string
  status: string
  createdOn: string
}

export const addToWaitlist = async (data: { email: string }): Promise<void> => {
  const entry: WaitlistEntry = {
    email: data.email,
    status: 'PENDING',
    createdOn: new Date().toISOString(),
  }

  await put(process.env.WAITLIST_TABLE as string, entry)
}
