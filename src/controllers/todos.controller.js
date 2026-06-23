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

module.exports = {
    createTodo
};
