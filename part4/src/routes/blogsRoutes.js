const { Router } = require('express')
const controller = require('../controllers/blogsControllers')

const router = Router()

router.get('/api/blogs', controller.getAll)
router.post('/api/blogs', controller.create)

module.exports = router
