const express = require('express');

const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { createTodo, getTodos } = require('../controllers/todos.controller');

const router = express.Router();

router.post('/', authenticate, asyncHandler(createTodo));
router.get('/', authenticate, asyncHandler(getTodos));

module.exports = router;
