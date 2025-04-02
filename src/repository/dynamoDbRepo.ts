import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, QueryCommandInput, ScanCommand } from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB client and document client
const client = new DynamoDBClient({})
export const docClient = DynamoDBDocumentClient.from(client)

// Common function to perform a scan operation
export const scan = async (tableName: string, filterExpression?: string, expressionAttributeValues?: Record<string, any>) => {
  const params = {
    TableName: tableName,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
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
export const query = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  indexName?: string,
) => {
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    IndexName: indexName,
  }
  const result = await docClient.send(new QueryCommand(params))
  return result.Items || [] // Ensure an array is always returned
}
