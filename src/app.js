const express = require('express');

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.json({
        message: 'API is running'
    });
});

/*
Example:

const usersRouter = require('./routes/users.routes');
app.use('/users', usersRouter);
*/
app.use('/auth', authRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
