const Router = require('express');
const router = new Router();

const portfolioController = require('../controllers/portfolioController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole(1), portfolioController.createPortfolioItem);
router.get('/', portfolioController.getPortfolio);
router.get('/:portfolio_id', portfolioController.getPortfolioItem);
router.delete('/:portfolio_id', checkRole(1), portfolioController.deletePortfolioItem); 
router.post('/portfolio/copy-all', portfolioController.copyAllPhotosFromService); // Новый маршрут для копирования всех фото

module.exports = router;