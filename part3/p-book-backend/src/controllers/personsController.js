const Person = require('../models/person')

const getRoot = (_request, response) => {
  response.send('<h1>Hello World!</h1>')
}

const getAll = async (_request, response, next) => {
  try {
    const persons = await Person.getAll()
    response.json(persons)
  } catch (error) {
    next(error)
  }
}

const getInfo = async (_request, response, next) => {
  try {
    const count = await Person.getCount()
    const now = new Date()
    response.send(`
      <h1>Phonebook</h1>
      <p>This phonebook has info for ${count} people.</p>
      <p>${now.toString()}</p>
    `)
  } catch (error) {
    next(error)
  }
}

const getById = async (request, response, next) => {
  try {
    const person = await Person.getById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
}

const deleteById = async (request, response, next) => {
  try {
    const person = await Person.deleteById(request.params.id)
    if (person) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
}

const create = async (request, response, next) => {
  try {
    const { name, number } = request.body
    if (!name) {
      return response.status(400).json({ error: 'name missing' })
    }
    if (!number) {
      return response.status(400).json({ error: 'number missing' })
    }
    // name must be unique. if not
    // Just let the INSERT fail and the errorHandler catches error.code === "23505"
    const person = await Person.create(name, number)
    response.json(person)
  } catch (error) {
    next(error)
  }
}

const update = async (request, response, next) => {
  try {
    const { name, number } = request.body
    const id = request.params.id
    const person = await Person.update(id, name, number)
    if (person) {
      response.json(person)
    } else {
      response.status(404).json({ error: 'person not found' })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { getRoot, getAll, getInfo, getById, deleteById, create, update }
