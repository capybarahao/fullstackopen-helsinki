const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM blogs')
  return result.rows
}

const create = async (title, author, url, likes) => {
  const result = await pool.query(
    'INSERT INTO blogs (title, author, url, likes) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, author, url, likes ?? 0]
  )
  return result.rows[0]
}

module.exports = { getAll, create }
