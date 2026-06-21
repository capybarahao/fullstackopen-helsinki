const { Router } = require('express')
const controller = require('../controllers/loginControllers')

const router = Router()

router.post('/api/login', controller.login)

module.exports = router
