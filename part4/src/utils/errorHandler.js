const errorHandler = (error, _request, response, _next) => {
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  response.status(500).json({ error: 'internal server error' })
}

module.exports = errorHandler
