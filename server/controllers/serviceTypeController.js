const {ServiceType} = require('../models/models');
const ApiError = require('../error/ApiError');

class ServiceTypeController {
    async createServiceType(req, res, next) {
        try{
            const { service_type_name } = req.body;

            if (!service_type_name) {
                return next(ApiError.badRequest('Имя типа услуги обязательно'));
            }

            const service_type = await ServiceType.create({service_type_name});
            return res.status(201).json(service_type);  // 201 - создано
        } catch (e) {
            next(ApiError.internal('Ошибка при создании типа услуги: ' + e.message));
        }
    }

    async getServiceTypes(req, res, next) {
        try {
            const service_types = await ServiceType.findAll();  
            return res.json(service_types);
        } catch (e) {
            next(ApiError.internal('Ошибка при выводе типов услуг: ' + e.message));
        }
    }

    async updateServiceType(req, res, next) {
        try {
            const { service_type_id } = req.params;
            const { service_type_name } = req.body;

            const service_type = await ServiceType.findOne({
                where: { service_type_id }
            })

            if (!service_type) {
                return next(ApiError.notFound('Тип услуги не найден'));
            }

            await ServiceType.update(
                {
                    service_type_name: service_type_name || service.service_type_name
                },
                {
                    where: { service_type_id }
                }
            );

            const updatedServiceType = await ServiceType.findOne({ where: { service_type_id } });
            return res.json(updatedServiceType);
        } catch (e) {
            next(ApiError.internal('Ошибка при обновлении типа услуги: ' + e.message));
        }
    }

    async deleteServiceType(req, res, next) {
        try {
            const { service_type_id } = req.params;
            const service_type = await ServiceType.findOne({ where: { service_type_id } });

            if (!service_type) {
                return next(ApiError.notFound('Тип услуги не найден'));
            }

            await ServiceType.destroy({ where: { service_type_id } });

            return res.json({ message: 'Услуга успешно удалена' });
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении типа услуги: ' + e.message));
        }
    }
}

module.exports = new ServiceTypeController();