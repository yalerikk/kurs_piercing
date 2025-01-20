const { Review, Client, User, Appointment, Service } = require('../models/models');
const ApiError = require('../error/ApiError');
const notificationController = require('./notificationController');

class ReviewController {
    // Оставить отзыв
    async createReview(req, res, next) {
        try {
            const { review_rating, review_text, appointment_id, client_id } = req.body;

            // Проверка наличия обязательных данных (review_rating не равен undefined (было передано))
            if (review_rating === undefined || !appointment_id || !client_id) {
                return next(ApiError.badRequest('Все поля обязательны'));
            }

            const review = await Review.create({
                review_rating, review_text, appointment_id, client_id
            });
            // уведомление о том, что отзыв успешно написан
            await notificationController.notifyClientAboutNewReview(client_id);
            return res.status(201).json(review);
        } catch (e) {
            next(ApiError.internal('Ошибка при создании отзыва: ' + e.message));
        }
    }

    // Просмотр отзывов
    async getReviews(req, res, next) {
        try {
            const { client_id } = req.query;

            // Определяем условия для поиска
            const whereCondition = client_id ? { client_id } : {};

            // Получаем отзывы с включением связанных моделей
            const reviews = await Review.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Client,
                        include: [
                            {
                                model: User,
                                attributes: ['user_name'] // Извлекаем имя пользователя
                            }
                        ]
                    },
                    {
                        model: Appointment,
                        include: [
                            {
                                model: Service,
                                attributes: ['service_name'] // Извлекаем название услуги
                            }
                        ]
                    }
                ]
            });

            return res.json(reviews);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении всех отзывов: ' + e.message));
        }
    }

    // Удаление отзыва мастером
    async deleteReview(req, res, next) {
        try {
            const { review_id } = req.params;

            // Валидация review_id
            if (!review_id) {
                return next(ApiError.badRequest('Не указан идентификатор отзыва'));
            }

            const deletedReview = await Review.destroy({ where: { review_id } });

            if (!deletedReview) {
                return next(ApiError.badRequest('Отзыв не найден'));
            }

            return res.json({ message: 'Отзыв успешно удален' });
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении отзыва: ' + e.message ));
        }
    }
}

module.exports = new ReviewController();