import { InvocationType, InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

const lambdaClient = new LambdaClient({})

export const invokeLambda = async (functionName: string, payload: any, invocationType: InvocationType = InvocationType.RequestResponse) => {
  const params = {
    FunctionName: functionName,
    InvocationType: invocationType,
    Payload: Buffer.from(JSON.stringify(payload)),
  }

  const command = new InvokeCommand(params)
  const response = await lambdaClient.send(command)

  if (response.Payload) {
    return JSON.parse(Buffer.from(response.Payload).toString())
  }

  return null
}
