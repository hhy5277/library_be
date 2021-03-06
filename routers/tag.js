const Tag = require('../controllers/tag')
const router = require('koa-router')({prefix : '/tag'})
const auth = require('../config/auth')

router.get('/', Tag.list)
router.get('/search', Tag.search)
router.get('/:id', Tag.get)
router.post('/', auth.isAdmin, Tag.save)
router.delete('/', auth.isAdmin, Tag.delete)

module.exports = router;