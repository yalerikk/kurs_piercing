const Router = require('express');
const router = new Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/reg', userController.reg);
router.post('/login', userController.login);
// авторизован?
router.get('/auth', authMiddleware, userController.auth);

module.exports = router;