const Router = require('express');
const router = new Router();

const studioController = require('../controllers/studioController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole(1), studioController.createStudio);
router.get('/', studioController.getStudio);
router.put('/:studio_id', checkRole(1), studioController.updateStudio);

module.exports = router;