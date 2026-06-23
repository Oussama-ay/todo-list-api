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

async function getTodosByUserId(userId) {
    const result = await pool.query(
        `
        SELECT id, title, description, status, created_at, updated_at
        FROM todos
        WHERE user_id = $1
        ORDER BY id ASC
        `,
        [userId]
    );

    return result.rows.map(mapTodo);
}

module.exports = {
    createTodo,
    getTodosByUserId,
};
