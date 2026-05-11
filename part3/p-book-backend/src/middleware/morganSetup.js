const morgan = require('morgan')

// morgan custom formats!!
morgan.token('obj', (req) => {
  return JSON.stringify(req.body)
})

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms :obj'
)

module.exports = morganMiddleware
