const express = require('express');

const asyncHandler = require('../middleware/asyncHandler');
const authenticate = require('../middleware/authenticate');
const { createTodo } = require('../controllers/todos.controller');

const router = express.Router();

router.post('/', authenticate, asyncHandler(createTodo));

module.exports = router;
