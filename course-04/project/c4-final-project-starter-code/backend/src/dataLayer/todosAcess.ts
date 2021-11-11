import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly S3: any                   = createS3Client(),
    private readonly todosTable                = process.env.TODOS_TABLE,
    private readonly todosIndex                = process.env.TODOS_CREATED_AT_INDEX,
    private readonly logger                    = createLogger('todoAccess')
    ) {
  }


  async getTodosForUser(userId: String): Promise<TodoItem[]> {
    this.logger.log('info', `Getting todos for : ${userId} `)

    const todos = await this.docClient.query({
      TableName : this.todosTable,
      IndexName : this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()

    const items = todos.Items
    return items as TodoItem[]
  }

  async getAllTodos(): Promise<TodoItem[]> {
    this.logger.log('info', 'Getting all todos')

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    this.logger.log('info', `inside dataLayer:createTodo : todoId : ${todo.todoId}`);
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async generateUploadUrl(todoId: string, userId: string): Promise<string> {
      const bucket = process.env.ATTACHMENT_S3_BUCKET;
      const urlExp =  process.env.SIGNED_URL_EXPIRATION;

      const uploadUrl = this.S3.getSignedUrl("putObject", {
        Bucket: bucket,
        Key: todoId,
        Expires: urlExp
      });

      this.logger.log('info', `todosAccess - userId : ${userId} todoId : ${todoId} uploadUrl : ${uploadUrl}`)

      await this.docClient.update({
          TableName: this.todosTable,
          Key: { userId, todoId },
          UpdateExpression: "set attachmentUrl=:URL",
          ExpressionAttributeValues: {
            ":URL": uploadUrl.split("?")[0]
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();

    return uploadUrl;
  }


  async updateTodo(userId: String, todoId: String, updateTodo: UpdateTodoRequest) {
    console.log(`inside dataLayer:updateTodo : todoId : ${todoId}`);

    const todosTable = process.env.TODOS_TABLE

    const params = {
        TableName: todosTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
        UpdateExpression: "set #nm = :x, dueDate = :y, done = :z",
        ExpressionAttributeValues: {
            ":x": updateTodo.name,
            ":y": updateTodo.dueDate,
            ":z": updateTodo.done
        },
        ExpressionAttributeNames: {
            "#nm": "name"
        }
    };



    await this.docClient.update(params, function(err, data) {
        if (err) {
           console.log(`UpdateTodos : ${err}`); 
        } else {
           console.log(`UpdateTodos : ${data}`); 
        }
    }).promise();

  }

  async deleteTodo(userId: String, todoId: String) {
    var params = {
        TableName: this.todosTable,
        Key:{
            "userId": userId,
            "todoId": todoId
        }
    };

    this.docClient.delete(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });

  }


}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

function createS3Client() {
  return new XAWS.S3({
    signatureVersion: 'v4'
  })
}