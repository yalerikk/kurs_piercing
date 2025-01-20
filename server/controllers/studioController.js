const { Studio, Master } = require('../models/models');
const ApiError = require('../error/ApiError');

class StudioController {
    async createStudio(req, res, next) {
        try {
            const { studio_name, address, work_schedule } = req.body;

            // Получаем мастера по его ID
            const master = await Master.findOne({ where: { master_id: 1 } });
            if (!master) {
                return next(ApiError.notFound('Мастер не найден'));
            }

            // Создание студии
            const studio = await Studio.create({
                studio_name,
                studio_phone: master.user_phone, // Номер телефона студии равен номеру телефона мастера
                address,
                work_schedule,
            });

            return res.status(201).json(studio);
        } catch (error) {
            next(ApiError.badRequest('Ошибка при создании студии: ' + error.message));
        }
    }

    async getStudio(req, res, next) {
        try {
            const studios = await Studio.findAll({
                include: [{
                    model: Master,
                    attributes: ['master_id', 'master_description']
                }]
            });
            
            // Формирование ответа
            const result = studios.map(studio => ({
                studio_id: studio.studio_id,
                studio_name: studio.studio_name,
                studio_phone: studio.studio_phone, // Номер телефона студии
                address: studio.address,
                work_schedule: studio.work_schedule,
                master_description: studio.master.master_description // Описание мастера
            }));

            return res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении студий: ' + error.message));
        }
    }

    async updateStudio(req, res, next) {
        try {
            const { studio_id } = req.params;
            const { studio_name, address, work_schedule } = req.body;

            const studio = await Studio.findOne({ where: { studio_id } });
            if (!studio) {
                return next(ApiError.notFound('Студия не найдена'));
            }

            // Обновляем данные студии
            studio.studio_name = studio_name || studio.studio_name;
            studio.address = address || studio.address;
            studio.work_schedule = work_schedule || studio.work_schedule;

            // Получаем мастера, чтобы обновить телефон студии
            const master = await Master.findOne({ where: { master_id: 1 } });
            if (master) {
                studio.studio_phone = master.user_phone; // телефон студии = телефон мастера
            }

            await studio.save();

            return res.json({ studio });
        } catch (error) {
            next(ApiError.internal('Ошибка при обновлении студии: ' + error.message));
        }
    }
}

module.exports = new StudioController();