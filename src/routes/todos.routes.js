const express = require('express');

const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { createTodo, getTodos, getTodoById } = require('../controllers/todos.controller');

const router = express.Router();

router.post('/', authenticate, asyncHandler(createTodo));
router.get('/', authenticate, asyncHandler(getTodos));
router.get('/:id', authenticate, asyncHandler(getTodoById));

module.exports = router;
