const pool = require('../config/db')

const createUser = async (username, name, passwordHash) => {
  const result = await pool.query(
    'INSERT INTO users (username, name, passwordHash) VALUES ($1, $2, $3) RETURNING *',
    [username, name, passwordHash]
  )
  return result.rows[0]
}
module.exports = { createUser }
