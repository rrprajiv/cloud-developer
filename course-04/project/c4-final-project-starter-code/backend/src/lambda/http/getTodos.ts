import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { getTodosForUser } from '../../businessLogic/todos'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'


//import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';


const logger  = createLogger('createTodo')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event);

    logger.log('info', `inside getTodos for user : ${userId}`)
    const items = await getTodosForUser(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "items": items
      })
    }

  }
)

handler.use(
  cors({
    credentials: true
  })
)
