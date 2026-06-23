const { Router } = require('express')
const controller = require('../controllers/blogsControllers')
const { userExtractor } = require('../utils/middleware')

const router = Router()

router.get('/api/blogs', controller.getAll)
router.post('/api/blogs', userExtractor, controller.create)
router.put('/api/blogs/:id', controller.update)
router.delete('/api/blogs/:id', userExtractor, controller.deleteById)

module.exports = router
