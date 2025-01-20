const Router = require('express');
const router = new Router();

const serviceTypeController = require('../controllers/serviceTypeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole(1), serviceTypeController.createServiceType);
router.get('/', serviceTypeController.getServiceTypes);
router.put('/:service_type_id', checkRole(1), serviceTypeController.updateServiceType);
router.delete('/:service_type_id', checkRole(1), serviceTypeController.deleteServiceType);

module.exports = router;