// Handles requests to routes that don't exist.
const unknownEndpoint = (_request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

module.exports = unknownEndpoint
