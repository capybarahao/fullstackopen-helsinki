const Blog = require('../models/blog')

const getAll = async (_request, response, next) => {
  try {
    const blogs = await Blog.getAll()
    response.json(blogs)
  } catch (error) {
    next(error)
  }
}

const create = async (request, response, next) => {
  try {
    const { title, author, url } = request.body
    // if (!name) {
    //   return response.status(400).json({ error: 'name missing' })
    // }
    // if (!number) {
    //   return response.status(400).json({ error: 'number missing' })
    // }

    // title must be unique. if not
    // Just let the INSERT fail and the errorHandler catches error.code === "23505"
    const blog = await Blog.create(title, author, url)
    response.json(blog)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, create }
