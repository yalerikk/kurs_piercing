const Router = require('express');
const router = new Router();

const masterController = require('../controllers/masterController');
const checkRole = require('../middleware/checkRoleMiddleware');

// Получение мастера
router.get('/:master_id', masterController.getMaster);
// Создание нового мастера
router.post('/', checkRole(1), masterController.createMaster);
// Обновление мастера
router.put('/:master_id', checkRole(1), masterController.updateMaster);

module.exports = router;