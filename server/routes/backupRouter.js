const Router = require('express');
const router = new Router();

const backupController = require('../controllers/backupController');
const checkRole = require('../middleware/checkRoleMiddleware');

// Создание резервной копии по требованию
router.post('/', checkRole(1), backupController.masterBackup);

module.exports = router;