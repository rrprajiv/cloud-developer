import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import * as createHttpError from 'http-errors'





export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId                         = getUserId(event);
    const todoId                         = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)


    try {
      console.log(`Inside updateTodo - userId : ${userId} todoId : ${todoId}`)
      await updateTodo(userId, todoId, updatedTodo);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({})
      }
    } catch(e) {
        console.log(`Failed to update : ${e.message}`)
        throw new createHttpError.HttpError(`Failed to update : ${e.message}`)
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
