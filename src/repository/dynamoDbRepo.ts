import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB client and document client
const client = new DynamoDBClient({})
export const docClient = DynamoDBDocumentClient.from(client)

// Common function to perform a scan operation
export const scan = async (tableName: string) => {
  const params = {
    TableName: tableName,
  }
  const result = await docClient.send(new ScanCommand(params))
  return result.Items || []
}

// Common function to perform a get operation
export const get = async (tableName: string, key: Record<string, any>) => {
  const params = {
    TableName: tableName,
    Key: key,
  }
  const result = await docClient.send(new GetCommand(params))
  return result.Item // Return the item or undefined
}

// Common function to perform a put operation
export const put = async (tableName: string, item: Record<string, any>) => {
  const params = {
    TableName: tableName,
    Item: item,
  }
  await docClient.send(new PutCommand(params))
}

// Common function to perform a query operation
export const query = async (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: `${keyConditionExpression} = :${keyConditionExpression}`,
    ExpressionAttributeValues: expressionAttributeValues,
  }
  const result = await docClient.send(new QueryCommand(params))
  return result.Items
}

// Environment variables for table names
const USERS_TABLE = process.env.USERS_TABLE as string
const MEDICAL_REPORTS_TABLE = process.env.MEDICAL_REPORTS_TABLE as string
const TEST_PARAMETERS_TABLE = process.env.TEST_PARAMETERS_TABLE as string

// Find users by patient name using a scan operation
export const findUserByName = async (patientName: string): Promise<any[]> => {
  const upperCaseName = patientName.toUpperCase()
  const params = {
    TableName: USERS_TABLE,
    FilterExpression: 'patient_name = :patient_name',
    ExpressionAttributeValues: {
      ':patient_name': upperCaseName,
    },
  }

  const result = await scan(USERS_TABLE) // Use the common scan function
  return result
}

// Save a new user to the UsersTable
export const saveUser = async (userId: string, userInfo: Record<string, any>): Promise<void> => {
  await put(USERS_TABLE, { userId, ...userInfo }) // Use the common put function
}

// Save test parameters including test key, unit, and name
export const saveTestParameter = async (testKey: string, unit: string, testName: string): Promise<void> => {
  await put(TEST_PARAMETERS_TABLE, { testKey, unit, testName }) // Use the common put function
}

// Check if a medical report exists for a user on a specific date
export const checkExistingReport = async (userId: string, date: string): Promise<boolean> => {
  const params = {
    TableName: MEDICAL_REPORTS_TABLE,
    KeyConditionExpression: '#userId = :userId AND #date = :date',
    ExpressionAttributeNames: {
      '#userId': 'userId',
      '#date': 'date',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':date': date,
    },
  }

  const result = await docClient.send(new QueryCommand(params))
  return !!(result.Items && result.Items.length > 0)
}

// Save a medical report with dynamic attributes
export const saveMedicalReport = async (userId: string, date: string, reportData: Record<string, string>, accountId: string): Promise<void> => {
  await put(MEDICAL_REPORTS_TABLE, { userId, date, accountId, ...reportData }) // Use the common put function
}

// Scan the TestParametersTable to retrieve all test parameters
export const scanTestParameters = async (): Promise<any[]> => {
  return await scan(TEST_PARAMETERS_TABLE) // Use the common scan function
}

// Fetch a user by email using a scan operation
export const getUserByUsernameFromDb = async (email: string): Promise<any | undefined> => {
  const params = {
    TableName: USERS_TABLE,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  }

  const result = await scan(USERS_TABLE) // Use the common scan function
  return result.length > 0 ? result[0] : undefined // Return the first user found or undefined
}
