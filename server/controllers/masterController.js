const { Master, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class MasterController {
    async getMaster(req, res, next) {
        try {
            const master = await Master.findOne({
                include: [{ model: User }] // Включаем связанные записи пользователя
            });
            if (!master) {
                return next(ApiError.notFound('Мастер не найден'));
            }
            return res.json(master);
        } catch (e) {
            next(ApiError.badRequest('Ошибка при получении мастера: ' + e.message));
        }
    }

    async createMaster(req, res, next) {
        try {
            const { user_id, master_description } = req.body;

            // Проверка существования пользователя
            const user = await User.findByPk(user_id);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            // Проверяем, есть ли уже мастер
            const existingMaster = await Master.findOne();
            if (existingMaster) {
                return next(ApiError.badRequest('Мастер уже существует'));
            }

            const master = await Master.create({ user_id, master_description });
            return res.status(201).json(master);
        } catch (e) {
            next(ApiError.internal('Ошибка при создании мастера: ' + e.message));
        }
    }

    async updateMaster(req, res, next) {
        try {
            const { master_description } = req.body;

            const master = await Master.findOne();
            if (!master) {
                return next(ApiError.notFound('Мастер не найден'));
            }

            master.master_description = master_description;
            await master.save();

            return res.json(master);
        } catch (e) {
            next(ApiError.badRequest('Ошибка при обновлении мастера: ' + e.message));
        }
    }
}

module.exports = new MasterController();