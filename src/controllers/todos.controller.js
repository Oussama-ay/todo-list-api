const todosService = require('../services/todos.service');

function validateCreateTodoBody(body) {
	if (!body) {
		return null;
	}

	const { title, description } = body;

	if (typeof title !== 'string' || !title.trim()) {
		return null;
	}

	if (description !== undefined && typeof description !== 'string') {
		return null;
	}

	return {
		title: title.trim(),
		description: description ? description.trim() : null
	};
}

async function createTodo(req, res) {
	const todoData = validateCreateTodoBody(req.body);

	if (!todoData) {
		return res.status(400).json({
			error: 'title is required and description must be a string if provided'
		});
	}

	const todo = await todosService.createTodo(
		req.user.id,
		todoData
	);

	res.status(201).json({
		message: 'Todo created successfully',
		todo
	});
}

function parsePositiveInteger(value, defaultValue, fieldName) {
	if (value === undefined) {
		return defaultValue;
	}

	if (typeof value !== 'string') {
		return null;
	}

	const number = Number(value);

	if (!Number.isInteger(number) || number <= 0) {
		throw new Error(`${fieldName} must be a positive integer`);
	}

	return number;
}

function validateTodosQuery(query) {
	const { status, page, limit } = query;

	const allowedStatuses = ['todo', 'in-progress', 'done'];

	if (
		status !== undefined &&
		(typeof status !== 'string' || !allowedStatuses.includes(status))
	) {
		return null;
	}

	try {
		const parsedPage = parsePositiveInteger(page, 1, 'page');
		const parsedLimit = parsePositiveInteger(limit, 10, 'limit');

		if (parsedLimit > 100) {
			return null;
		}

		return {
			status,
			page: parsedPage,
			limit: parsedLimit
		};
	} catch {
		return null;
	}
}

async function getTodos(req, res) {
	const queryOptions = validateTodosQuery(req.query);

	if (!queryOptions) {
		return res.status(400).json({
			error: 'status must be todo, in-progress, or done; page and limit must be positive integers; limit cannot exceed 100'
		});
	}

	const result = await todosService.getTodosByUserId(
		req.user.id,
		queryOptions
	);

	res.json(result);
}

function parseTodoId(idValue) {
	const todoId = Number(idValue);

	if (!Number.isInteger(todoId) || todoId <= 0) {
		return null;
	}

	return todoId;
}

async function getTodoById(req, res) {
	const todoId = parseTodoId(req.params.id);

	if (!todoId) {
		return res.status(400).json({
			error: 'Todo ID must be a positive integer'
		});
	}

	const todo = await todosService.getTodoByIdAndUserId(
		todoId,
		req.user.id
	);

	if (!todo) {
		return res.status(404).json({
			error: `Todo with ID ${todoId} not found`
		});
	}

	res.json(todo);
}

function validateUpdateTodoBody(body) {
	if (!body) {
		return null;
	}

	const { title, description, status } = body;

	if (
		typeof title !== 'string' ||
		!title.trim()
	) {
		return null;
	}

	if (
		description !== undefined &&
		description !== null &&
		typeof description !== 'string'
	) {
		return null;
	}

	const allowedStatuses = ['todo', 'in-progress', 'done'];

	if (!allowedStatuses.includes(status)) {
		return null;
	}

	return {
		title: title.trim(),
		description:
			typeof description === 'string'
				? description.trim()
				: null,
		status
	};
}

async function updateTodo(req, res) {
	const todoId = parseTodoId(req.params.id);

	if (!todoId) {
		return res.status(400).json({
			error: 'Todo ID must be a positive integer'
		});
	}

	const todoData = validateUpdateTodoBody(req.body);

	if (!todoData) {
		return res.status(400).json({
			error: 'title is required, description must be a string if provided, and status must be todo, in-progress, or done'
		});
	}

	const updatedTodo = await todosService.updateTodoByIdAndUserId(
		todoId,
		req.user.id,
		todoData
	);

	if (!updatedTodo) {
		return res.status(404).json({
			error: `Todo with ID ${todoId} not found`
		});
	}

	res.json({
		message: 'Todo updated successfully',
		todo: updatedTodo
	});
}

async function deleteTodo(req, res) {
	const todoId = parseTodoId(req.params.id);

	if (!todoId) {
		return res.status(400).json({
			error: 'Todo ID must be a positive integer'
		});
	}

	const wasDeleted = await todosService.deleteTodoByIdAndUserId(
		todoId,
		req.user.id
	);

	if (!wasDeleted) {
		return res.status(404).json({
			error: `Todo with ID ${todoId} not found`
		});
	}

	res.status(204).send();
}

module.exports = {
	createTodo,
	getTodos,
	getTodoById,
	validateUpdateTodoBody,
	updateTodo,
	deleteTodo
};
