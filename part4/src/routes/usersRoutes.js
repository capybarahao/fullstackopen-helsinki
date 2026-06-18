const { Router } = require('express')
const controller = require('../controllers/usersControllers')

const router = Router()

router.post('/api/users', controller.createUser)

module.exports = router
