const Blog = require('../models/blog')

const getAll = async (_request, response, _next) => {
  const blogs = await Blog.getAll()
  response.json(blogs)
}

const create = async (request, response, _next) => {
  const { title, author, url, likes } = request.body

  if (!title) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (!url) {
    return response.status(400).json({ error: 'url missing' })
  }

  const blog = await Blog.create(title, author, url, likes)
  response.status(201).json(blog)
}

deleteById

module.exports = { getAll, create }
