const pool = require('../config/db')

const getAll = async () => {
  const result = await pool.query('SELECT * FROM persons')
  return result.rows
}

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM persons WHERE id = $1', [id])
  return result.rows[0]
}

const create = async (name, number) => {
  const result = await pool.query(
    'INSERT INTO persons (name, number) VALUES ($1, $2) RETURNING *',
    [name, number]
  )
  return result.rows[0]
}

const update = async (id, name, number) => {
  const result = await pool.query(
    'UPDATE persons SET name = $1, number = $2 WHERE id = $3 RETURNING *',
    [name, number, id]
  )
  return result.rows[0]
}

const deleteById = async (id) => {
  const result = await pool.query('DELETE FROM persons WHERE id = $1 RETURNING *', [id])
  return result.rows[0]
}

const getCount = async () => {
  const result = await pool.query('SELECT COUNT(*) FROM persons')
  return result.rows[0].count
}

module.exports = { getAll, getById, create, update, deleteById, getCount }
