// | Client errors (4xx) | Inline, right where you detect them | Missing fields, wrong password, not found, forbidden |
// | Unexpected/exceptional errors (5xx) | Global error handler | DB connection failure, jwt.verify() throw, programming bugs |

// The philosophy: 4xx inline, 5xx global
// Client errors (4xx) → handle right where you detect them
//   "title missing" → 400 in controller
//   "unauthorized"  → 403 in controller
//   "not found"     → 404 in controller
// Exceptional errors (5xx) → let them fly to the global handler
//   DB crash           → errorHandler returns 500
//   jwt.verify() throw → errorHandler returns 401
//   programming bug    → errorHandler returns 500
// Why? A 400 response isn't an "error" — it's a deliberate, predictable part of your API's contract. Handling it inline keeps the validation logic next to the code that checks it.
const errorHandler = (error, _request, response, _next) => {
  console.error(error)

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  // db level error
  // unique_violation. Creating a user with an existing username
  if (error.code === '23505') {
    return response.status(400).json({ error: 'username must be unique' })
  }
  // foreign_key_violation	Creating a blog with a non-existent user_id
  if (error.code === '23503') {
    return response.status(400).json({ error: 'referenced user does not exist' })
  }

  response.status(500).json({ error: 'internal server error' })
}

module.exports = errorHandler
