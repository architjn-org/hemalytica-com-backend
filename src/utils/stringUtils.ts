export const generateTestKey = (testName: string): string => {
  return testName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') // Remove leading or trailing underscores
}
