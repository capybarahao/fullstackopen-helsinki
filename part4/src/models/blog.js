const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM blogs')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id])
  return result.rows[0]
}

const create = async (title, author, url, likes) => {
  const result = await pool.query(
    'INSERT INTO blogs (title, author, url, likes) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, author, url, likes ?? 0]
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
