const Router = require('express');
const router = new Router();

const notificationController = require('../controllers/notificationController');

// Создание уведомления +
router.post('/', notificationController.createNotification);
// Получение уведомлений для пользователя +
router.get('/:user_id', notificationController.getNotifications);
// Получение конкретного уведомления по ID +
router.get('/notification/:notification_id', notificationController.getNotificationById);

/*
    Уведомления клиенту:
    1) успешно записался
    2) успешно отменил
    3) успешно завершил запись и начислили ему балл (только для проколов)

    Уведомления мастеру:
    1) клиент успешно записался
    2) клиент успешно отменил
*/

module.exports = router;