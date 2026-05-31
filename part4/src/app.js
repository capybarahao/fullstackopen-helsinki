const express = require('express')
// allow for requests from all origins
const cors = require('cors')
// db.js pool module for faster and efficient data reading/writing
const pool = require('./config/db')
const logger = require('./utils/logger')
const routes = require('./routes/blogsRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use(routes)

// verify database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error('Database connection failed:', err.message)
  } else {
    logger.info('Database connected successfully!')
  }
})

module.exports = app
