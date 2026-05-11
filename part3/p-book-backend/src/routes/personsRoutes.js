const { Router } = require('express')
const controller = require('../controllers/personsController')

const router = Router()

router.get('/', controller.getRoot)
router.get('/info', controller.getInfo)
router.get('/api/persons', controller.getAll)
router.get('/api/persons/:id', controller.getById)
router.delete('/api/persons/:id', controller.deleteById)
router.post('/api/persons', controller.create)
router.put('/api/persons/:id', controller.update)

module.exports = router
