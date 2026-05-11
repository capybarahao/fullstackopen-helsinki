const express = require('express')
// allow for requests from all origins
const cors = require('cors')
// db.js pool module for faster and efficient data reading/writing
const pool = require('./config/db')
const logger = require('./utils/logger')
const morganMiddleware = require('./middleware/morganSetup')
const routes = require('./routes/personsRoutes')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Middleware are functions that can be used for
// handling request and response objects
// Middleware is used like this:
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morganMiddleware)

// verify database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    logger.error('Database connection failed:', err.message)
  } else {
    logger.info('Database connected successfully!')
  }
})

app.use(routes)
app.use(unknownEndpoint)
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

module.exports = app
