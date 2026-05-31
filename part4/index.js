// a lot of layers starting from this index
// index.js -> app.js -> personsRoutes.js -> ~Controller.js -> person.js
// ask agent for a broader map of this fullstack project
const app = require('./src/app')
const logger = require('./src/utils/logger')

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
