const express = require('express')
// allow for requests from all origins
const cors = require('cors')
// db.js pool module for faster and efficient data reading/writing
const pool = require('./config/db')
const logger = require('./utils/logger')
const blogsRoutes = require('./routes/blogsRoutes')
const usersRoutes = require('./routes/usersRoutes')
const loginRoutes = require('./routes/loginRoutes')

const { tokenExtractor, userExtractor } = require('./utils/middleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use(tokenExtractor) // runs on every request, just reads the header, no DB call, no rejection
app.use(blogsRoutes) // routes that need auth use userExtractor per-route
app.use(usersRoutes)
app.use(loginRoutes)

// verify database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error('Database connection failed:', err.message)
  } else {
    logger.info('Database connected successfully!')
  }
})

module.exports = app
