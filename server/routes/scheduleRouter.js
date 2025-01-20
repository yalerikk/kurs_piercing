const Router = require('express');
const router = new Router();

const scheduleController = require('../controllers/scheduleController');
const checkRole = require('../middleware/checkRoleMiddleware');

// +
router.post('/', scheduleController.generateSchedule);
// +
router.get('/view-client/:date', scheduleController.viewClientSchedule);
// +
router.get('/view-master/:date', checkRole(1), scheduleController.viewMasterSchedule);
// +
router.delete('/:schedule_id', checkRole(1), scheduleController.deleteSchedule);
// +
router.delete('/del-by-date/:schedule_date', checkRole(1), scheduleController.deleteSlotsByDate);

module.exports = router;