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

async function getTodos(req, res) {
    const todos = await todosService.getTodosByUserId(req.user.id);

    res.json(todos);
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

module.exports = {
    createTodo,
	getTodos,
	getTodoById
};
