import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../utils'
import * as createHttpError from 'http-errors'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId     = event.pathParameters.todoId
    const userId     = getUserId(event);
    const todosTable = process.env.TODOS_TABLE
    const todosIndex = process.env.TODOS_CREATED_AT_INDEX

    const logger = createLogger('qqq')
    logger.log('info', `deleteTodos : Table : ${todosTable} Index : ${todosIndex} userId : ${userId} todoId : ${todoId}`);

    try {
      await deleteTodo(userId, todoId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({})
      }
    } catch (e) {
        throw new createHttpError.HttpError('Failed to delete')
    }

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
