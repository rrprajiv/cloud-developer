import { TodoAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { parseUserId } from "../auth/utils";

// TODO: Implement businessLogic
export async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string) : Promise<TodoItem> {
	// userId: string
  // todoId: string
  // createdAt: string
  // name: string
  // dueDate: string
  // done: boolean
  // attachmentUrl?: string
	const userId    = parseUserId(jwtToken);
	const todoId    = uuid.v4();
	const createdAt = new Date().toISOString();
	const dueDate   = createTodoRequest.dueDate;
	const name      = createTodoRequest.name;
	const done: boolean = false;
	const attachmentUrl = "";

	const todoItem : TodoItem = {
		userId,
		todoId,
		createdAt,
		name,
		dueDate,
		done,
		attachmentUrl
	};
  //async createTodo(todo: TodoItem): Promise<TodoItem> {
	return TodoAccess.createTodo(todoItem);
}
export async function deleteTodo() {
	// should return an empty body.
	// Expects an id of a TODO item to remove

}
export async function createAttachmentPresignedUrl() {
	// should return a JSON object

}
export async function getTodosForUser() {

}
export async function updateTodo(updateTodoRequest: UpdateTodoRequest, jwtToken: string) {

}