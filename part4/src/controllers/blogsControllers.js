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
    const { title, author, url, likes } = request.body

    if (!title) {
      return response.status(400).json({ error: 'title missing' })
    }
    if (!url) {
      return response.status(400).json({ error: 'url missing' })
    }

    const blog = await Blog.create(title, author, url, likes)
    response.status(201).json(blog)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, create }
