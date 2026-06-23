const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { SECRET } = require('../config/config')

// --------------------------------------------------
// POST /api/login
// Accepts { username, password } in the request body.
// If valid, returns a signed JWT token along with
// the user's username and name.
// --------------------------------------------------
const login = async (request, response) => {
  const { username, password } = request.body

  const user = await User.findByUsername(username)

  //    use the same generic message for both "wrong username"
  //    and "wrong password" so attackers can't guess which is which.
  if (!user) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  // 3. Compare the provided password with the stored hash
  //    bcrypt.compare() hashes the input and compares safely
  const passwordCorrect = await bcrypt.compare(password, user.passwordhash)
  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  // 4. Create a minimal payload for the JWT
  //    Never put sensitive data (like the password hash) in the token
  const userForToken = { id: user.id, username: user.username }

  // 5. Sign the token with the server's SECRET
  //    jwt.sign() returns a signed string like:
  //    eyJhbGciOiJIUzI1NiIs...
  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

  // 6. Return the token and basic user info
  //    The client will store the token and send it as
  //    Authorization: Bearer <token> on subsequent requests
  response.status(200).json({ token, username: user.username, name: user.name })
}

module.exports = { login }
