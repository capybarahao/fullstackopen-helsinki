const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query(
    `SELECT blogs.*, users.username AS user_username, users.name AS user_name
     FROM blogs JOIN users ON blogs.user_id = users.id` // join tables to get also the creators/users
  )
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id])
  return result.rows[0]
}

const create = async (title, author, url, likes, user_id) => {
  const result = await pool.query(
    'INSERT INTO blogs (title, author, url, likes, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, author, url, likes ?? 0, user_id]
  )
  return result.rows[0]
}

const update = async (id, title, author, url, likes) => {
  const result = await pool.query(
    'UPDATE blogs SET title = $1, author = $2, url = $3, likes = $4 WHERE id = $5 RETURNING *',
    [title, author, url, likes, id]
  )
  return result.rows[0]
}

const deleteById = async (id) => {
  const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id])
  return result.rows[0]
}
module.exports = { getAll, getById, create, update, deleteById }
