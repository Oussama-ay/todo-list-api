# Todo List API
<img width="1833" height="780" alt="image" src="https://github.com/user-attachments/assets/e54fcc88-dd28-4c8f-b435-2a2ba03968f4" />

A REST API for managing personal todos with authentication, authorization, filtering, and pagination.

This project is based on the roadmap.sh Todo List API project:

https://roadmap.sh/projects/todo-list-api

## Features

* Register users
* Log in users with JWT authentication
* Hash passwords with bcrypt
* Create todos
* Get all todos for the authenticated user
* Get one todo by ID
* Update todos
* Delete todos
* Todo ownership authorization
* Filter todos by status
* Paginate todo lists
* PostgreSQL persistence
* Request logging middleware
* 404 route handling
* Centralized error handling
* Input validation

## Tech Stack

* Node.js
* Express
* PostgreSQL
* node-postgres (`pg`)
* bcrypt
* jsonwebtoken
* dotenv

## Project Structure

```txt
src/
├── app.js
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   └── todos.controller.js
├── middleware/
│   ├── asyncHandler.js
│   ├── authenticate.js
│   ├── errorHandler.js
│   ├── logger.js
│   └── notFound.js
├── routes/
│   ├── auth.routes.js
│   └── todos.routes.js
└── services/
    ├── auth.service.js
    └── todos.service.js
```

## Installation

```bash
git clone <your-repository-url>
cd todo-list-api
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Update the values in `.env`.

## Environment Variables

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_list
DB_USER=todo_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1h
```

## Database Setup

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT todos_status_check
        CHECK (status IN ('todo', 'in-progress', 'done'))
);
```

## Run the API

```bash
npm run dev
```

The API runs at:

```txt
http://localhost:3000
```

## Authentication Endpoints

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register a new user            |
| POST   | `/auth/login`    | Log in and receive a JWT token |

## Todo Endpoints

All todo routes require:

```http
Authorization: Bearer <your-jwt-token>
```

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| POST   | `/todos`     | Create a todo                  |
| GET    | `/todos`     | Get authenticated user's todos |
| GET    | `/todos/:id` | Get one todo                   |
| PUT    | `/todos/:id` | Update a todo                  |
| DELETE | `/todos/:id` | Delete a todo                  |

## Filtering and Pagination

```txt
GET /todos?status=done
GET /todos?page=1&limit=10
GET /todos?status=in-progress&page=1&limit=5
```

Allowed statuses:

```txt
todo
in-progress
done
```
