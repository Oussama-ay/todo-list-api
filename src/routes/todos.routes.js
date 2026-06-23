const express = require('express');

const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } = require('../controllers/todos.controller');

const router = express.Router();

router.post('/', authenticate, asyncHandler(createTodo));
router.get('/', authenticate, asyncHandler(getTodos));

router.get('/:id', authenticate, asyncHandler(getTodoById));
router.put('/:id', authenticate, asyncHandler(updateTodo));
router.delete('/:id', authenticate, asyncHandler(deleteTodo));

module.exports = router;
