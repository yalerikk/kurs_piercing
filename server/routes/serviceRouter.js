const Router = require('express');
const router = new Router();

const serviceController = require('../controllers/serviceController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole(1), serviceController.createService);
router.get('/', serviceController.getServices);
router.get('/:service_id', serviceController.getService);
router.put('/:service_id', checkRole(1), serviceController.updateService);
router.delete('/:service_id', checkRole(1), serviceController.deleteService);

module.exports = router;