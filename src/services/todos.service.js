const pool = require('../config/db');

function mapTodo(row) {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		status: row.status,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}

async function createTodo(userId, { title, description }) {
	const result = await pool.query(
		`
        INSERT INTO todos (user_id, title, description)
        VALUES ($1, $2, $3)
        RETURNING id, title, description, status, created_at, updated_at
        `,
		[userId, title, description]
	);

	return mapTodo(result.rows[0]);
}

async function getTodosByUserId(userId, { status, page, limit }) {
	const offset = (page - 1) * limit;

	const todosResult = await pool.query(
		`
        SELECT id, title, description, status, created_at, updated_at
        FROM todos
        WHERE user_id = $1
          AND ($2::text IS NULL OR status = $2)
        ORDER BY id ASC
        LIMIT $3
        OFFSET $4
        `,
		[userId, status || null, limit, offset]
	);

	const countResult = await pool.query(
		`
        SELECT COUNT(*)::int AS total
        FROM todos
        WHERE user_id = $1
          AND ($2::text IS NULL OR status = $2)
        `,
		[userId, status || null]
	);

	const total = countResult.rows[0].total;

	return {
		todos: todosResult.rows.map(mapTodo),
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}

async function getTodoByIdAndUserId(todoId, userId) {
	const result = await pool.query(
		`
        SELECT id, title, description, status, created_at, updated_at
        FROM todos
        WHERE id = $1
          AND user_id = $2
        `,
		[todoId, userId]
	);

	if (result.rows.length === 0) {
		return null;
	}

	return mapTodo(result.rows[0]);
}

async function updateTodoByIdAndUserId(todoId, userId, { title, description, status }) {
	const result = await pool.query(
		`
        UPDATE todos
        SET
            title = $1,
            description = $2,
            status = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
          AND user_id = $5
        RETURNING id, title, description, status, created_at, updated_at
        `,
		[title, description, status, todoId, userId]
	);

	if (result.rows.length === 0) {
		return null;
	}

	return mapTodo(result.rows[0]);
}

async function deleteTodoByIdAndUserId(todoId, userId) {
	const result = await pool.query(
		`
        DELETE FROM todos
        WHERE id = $1
          AND user_id = $2
        `,
		[todoId, userId]
	);

	return result.rowCount > 0;
}

module.exports = {
	createTodo,
	getTodosByUserId,
	getTodoByIdAndUserId,
	updateTodoByIdAndUserId,
	deleteTodoByIdAndUserId
};
