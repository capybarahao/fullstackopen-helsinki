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

const update = async (request, response, _next) => {
  const { title, author, url, likes } = request.body
  const existing = await Blog.getById(request.params.id)

  if (!existing) {
    return response.status(404).end()
  }
  const blog = await Blog.update(
    request.params.id,
    title ?? existing.title, // allow partially updates
    author ?? existing.author,
    url ?? existing.url,
    likes ?? existing.likes
  )
  response.json(blog)
}

const deleteById = async (request, response, _next) => {
  const blog = await Blog.deleteById(request.params.id)
  if (blog) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
}

module.exports = { getAll, create, update, deleteById }
