import { TodoAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

import { parseUserId } from "../auth/utils";

const todoAccess = new TodoAccess();

// TODO: Implement businessLogic
export async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string) : Promise<TodoItem> {
	// userId: string
  // todoId: string
  // createdAt: string
  // name: string
  // dueDate: string
  // done: boolean
  // attachmentUrl?: string
	const userId        = parseUserId(jwtToken);
	const todoId        = uuid.v4();
	const createdAt     = new Date().toISOString();
	const dueDate       = createTodoRequest.dueDate;
	const name          = createTodoRequest.name;
	const done: boolean = false;
	const attachmentUrl = "";
  const logger        = createLogger('createTodo')

	logger.log('info', `BL-todos : userId : ${userId} todoId : ${todoId}`);

	const todoItem : TodoItem = {
		userId,
		todoId,
		createdAt,
		name,
		dueDate,
		done,
		attachmentUrl
	};

	return await todoAccess.createTodo(todoItem);
}
export async function deleteTodo(userId: String, todoId: String) {
	await todoAccess.deleteTodo(userId, todoId)

}
//export async function getTodosForUser() {

//}

export async function updateTodo(userId: String, todoId: String, updateTodoRequest: UpdateTodoRequest) {
	return await todoAccess.updateTodo(userId, todoId, updateTodoRequest);
}