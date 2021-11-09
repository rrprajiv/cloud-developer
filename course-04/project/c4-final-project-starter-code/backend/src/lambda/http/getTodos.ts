import 'source-map-support/register'
import { createLogger } from '../../utils/logger'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import  * as AWS  from 'aws-sdk'
import { cors } from 'middy/middlewares'


//import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

const docClient = new AWS.DynamoDB.DocumentClient()

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event);

    
    const todosTable = process.env.TODOS_TABLE
    const todosIndex = process.env.TODOS_CREATED_AT_INDEX

    const logger = createLogger('zzzz')
    logger.log('info', 'Inside getTodos-Handler : TESTING LOGGER')

    console.log(`Inside getTodos Handler : Table : ${todosTable} Index : ${todosIndex}`)
    const todos = await docClient.query({
      TableName : todosTable,
      IndexName : todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()

    // const todos = '...'

    console.log(`userid : ${userId} todosCount : ${todos.Count}`);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        "items": todos.Items
      })
    }

  }
)

handler.use(
  cors({
    credentials: true
  })
)
