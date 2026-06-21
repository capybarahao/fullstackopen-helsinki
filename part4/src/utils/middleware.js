const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET } = require('../config/config')

// --------------------------------------------------
// tokenExtractor
// Reads the Authorization header and extracts the
// Bearer token. Attaches it to request.token so that
// userExtractor can use it later.
//
// This runs on EVERY request (no auth required here).
// If there's no token, request.token stays undefined
// and userExtractor will return 401.
// --------------------------------------------------
const tokenExtractor = (request, _response, next) => {
  // The Authorization header looks like:
  //   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  const authorization = request.get('authorization')

  if (authorization?.startsWith('Bearer ')) {
    // Slice off "Bearer " (7 characters) to get just the token
    request.token = authorization.replace('Bearer ', '')
  }

  // Always call next() — token being absent is not an error here.
  // userExtractor will handle the "no token" case later.
  next()
}

// --------------------------------------------------
// userExtractor
// Verifies the JWT from request.token, looks up the
// user in the database, and attaches the user object
// to request.user.
//
// This middleware returns:
//   401 if token is missing
//   401 if token is invalid (expired, tampered, etc.)
// --------------------------------------------------
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    // jwt.verify throws if the token is invalid or expired
    const decoded = jwt.verify(request.token, SECRET)

    // decoded looks like: { id: 1, username: 'mluukkai', iat: ... }
    // We look up the full user so controllers can use request.user.id
    request.user = await User.findByUsername(decoded.username)

    if (!request.user) {
      return response.status(401).json({ error: 'user not found' })
    }

    next()
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
}

module.exports = { tokenExtractor, userExtractor }
