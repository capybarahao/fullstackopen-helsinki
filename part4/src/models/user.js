const pool = require('../config/db')

const findByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return result.rows[0]
}

const createUser = async (username, name, passwordHash) => {
  const result = await pool.query(
    // exclude hash data at the SQL level
    'INSERT INTO users (username, name, password_hash) VALUES ($1, $2, $3) RETURNING id, username, name',
    [username, name, passwordHash]
  )
  return result.rows[0]
}
module.exports = { createUser, findByUsername }
