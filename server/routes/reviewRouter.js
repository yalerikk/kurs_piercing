const Router = require('express');
const router = new Router();

const reviewController = require('../controllers/reviewController');
const checkRole = require('../middleware/checkRoleMiddleware');

// Оставить отзыв могут только клиенты
router.post('/', checkRole(0), reviewController.createReview);
// Просматривать отзывы могут все
router.get('/', reviewController.getReviews);
// Удалить отзыв может только мастер
router.delete('/:review_id', checkRole(1), reviewController.deleteReview);

module.exports = router;