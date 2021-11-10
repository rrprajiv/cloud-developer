import { TodoAccess } from '../../dataLayer/todosAcess'
import 'source-map-support/register'
//import  * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
const todoAccess = new TodoAccess();

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId     = event.pathParameters.todoId
    const userId     = getUserId(event);
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    
    const presignedUrl = await todoAccess.generateUploadUrl(todoId, userId);

    console.log(`GenerateUploadUrl - todoId : ${todoId} url : ${presignedUrl}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({"uploadUrl": presignedUrl})
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
