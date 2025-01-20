const { Client, User, Appointment } = require('../models/models');
const ApiError = require('../error/ApiError');

class ClientController {
    async createClient(req, res, next) {
        const { user_id } = req.body; // user_id должен быть передан в теле запроса

        try {
            // Создаем нового клиента с 0 баллами лояльности
            const client = await Client.create({ user_id, loyalty_points: 0 });
            return res.status(201).json(client);
        } catch (error) {
            console.error('Ошибка при создании клиента:', error.message);
            return next(ApiError.internal('Ошибка при создании клиента'));
        }
    }

    async getClient(req, res, next) {
        const { client_id } = req.params;

        try {
            const client = await Client.findByPk(client_id);
            if (!client) return next(ApiError.notFound('Клиент не найден'));
            return res.json(client);
        } catch (error) {
            console.error('Ошибка при получении клиента:', error.message);
            return next(ApiError.internal('Ошибка при получении клиента'));
        }
    }
}

module.exports = new ClientController();