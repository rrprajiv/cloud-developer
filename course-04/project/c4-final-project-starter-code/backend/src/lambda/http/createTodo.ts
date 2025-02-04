import 'source-map-support/register'
import * as middy from 'middy'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const authorization              = event.headers.Authorization
    const split                      = authorization.split(' ')
    const jwtToken                   = split[1]

    // TODO: Implement creating a new TODO item
    // async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string) : Promise<TodoItem> {
    const logger  = createLogger('createTodo')
    const newItem = await createTodo(newTodo, jwtToken);
    logger.log('info', `createTodo :  name : ${newTodo.name}  dueDate : ${newTodo.dueDate} : newItem : ${newItem.userId}, ${newItem.todoId} ${newItem.createdAt}`)

    const item = {
      "item": newItem
    };

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)