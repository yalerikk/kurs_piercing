const Router = require('express');
const router = new Router();

const appointmentController = require('../controllers/appointmentController');
const checkRole = require('../middleware/checkRoleMiddleware');

// Создание записи +
router.post('/', checkRole(0), appointmentController.createAppointment);
// Статистика +
router.get('/statistics', checkRole(1), appointmentController.getStatistics);
// Получение информации о записи для просмотра мастером (по appointment_id) +
router.get('/:appointment_id', checkRole(1), appointmentController.getAppointmentDetails);
// Получение текущих записей для клиента (по client_id) +
router.get('/current/:client_id', checkRole(0), appointmentController.getCurrentAppointments);
// Получение истории услуг для клиента (по client_id) +
router.get('/history/:client_id', checkRole(0), appointmentController.getClientHistory);
// Отмена записи (по appointment_id) +
router.delete('/:appointment_id', checkRole(0), appointmentController.cancelAppointment);

module.exports = router;