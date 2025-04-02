import { addToWaitlist as addToWaitlistRepo } from '../repository/waitlistRepo'

export const addToWaitlist = async (data: { email: string }): Promise<void> => {
  await addToWaitlistRepo(data)
}
