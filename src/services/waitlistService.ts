import { addToWaitlist as addToWaitlistRepo, findWaitlistEntryByEmail } from '../repository/waitlistRepo'
import { ConflictError } from '../utils/errors'

export const addToWaitlist = async (data: { email: string }): Promise<void> => {
  // Check if email already exists
  const existingEntries = await findWaitlistEntryByEmail(data.email)
  if (existingEntries.length > 0) {
    throw new ConflictError('Email already exists in the waitlist')
  }

  await addToWaitlistRepo(data)
}
