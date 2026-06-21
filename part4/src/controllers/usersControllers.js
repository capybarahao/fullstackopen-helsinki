const User = require('../models/user')
const bcrypt = require('bcrypt')

const createUser = async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: 'username missing' })
  }
  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!password) {
    return response.status(400).json({ error: 'password missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedUser = await User.createUser(username, name, passwordHash)
  response.status(201).json(savedUser)
}

module.exports = { createUser }
