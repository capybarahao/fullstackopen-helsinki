const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM blogs')
  return result.rows
}

const create = async (title, author, url) => {
  const result = await pool.query(
    'INSERT INTO blogs (title, author, url) VALUES ($1, $2, $3) RETURNING *',
    [title, author, url]
  )
  return result.rows[0]
}

module.exports = { getAll, create }
