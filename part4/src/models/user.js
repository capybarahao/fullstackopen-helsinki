const pool = require('../config/db')

const findByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return result.rows[0]
}

const createUser = async (username, name, passwordHash) => {
  const result = await pool.query(
    'INSERT INTO users (username, name, passwordHash) VALUES ($1, $2, $3) RETURNING *',
    [username, name, passwordHash]
  )
  return result.rows[0]
}
module.exports = { createUser, findByUsername }
