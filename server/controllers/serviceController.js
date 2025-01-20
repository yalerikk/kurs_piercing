// генерация рандомных id, к-е не будут повторяться
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const { Service } = require('../models/models');
const ApiError = require('../error/ApiError');

class ServiceController {
    async createService(req, res, next) {
        try {
            const { service_name, service_description, service_price, service_type_id } = req.body;
            const { service_photo } = req.files;

            // Проверка наличия обязательных данных
            if (!service_photo) {
                return next(ApiError.badRequest('Файл услуги не загружен'));
            }
            if (!service_name || !service_price || !service_type_id) {
                return next(ApiError.badRequest('Имя услуги, ее тип и цена обязательны'));
            }

            // сохран файла фотки
            const fileName = await savePhoto(service_photo, 'services');

            const service = await Service.create({ service_name, service_description, service_price, 
                service_photo: fileName, service_type_id });
            return res.status(201).json(service);
        } catch (e) {
            next(ApiError.internal('Ошибка при создании услуги: ' + e.message));
        }
    }

    async getServices(req, res, next) {
        try {
            const {service_type_id} = req.query;
            let services;

            if(!service_type_id){
                services = await Service.findAll();
            }
            // фильтрация
            if (service_type_id) {
                services = await Service.findAll({where: {service_type_id}});
            }

            return res.json(services);
        } catch (e) {
            next(ApiError.internal('Ошибка при выводе услуг: ' + e.message));
        }
    }

    async getService(req, res, next) {
        try {
            const { service_id } = req.params;
            const service = await Service.findOne({
                where: {service_id}
            })

            if (!service) {
                return next(ApiError.notFound('Услуга не найдена'));
            }

            return res.json(service);
        } catch (e) {
            next(ApiError.internal('Ошибка при выводе услуги: ' + e.message));
        }
    }

    async updateService(req, res, next) {
        try {
            const { service_id } = req.params;
            const { service_name, service_description, service_price, service_type_id } = req.body;

            // Проверяем наличие загруженного файла
            const service_photo = req.files ? req.files.service_photo : null;

            const service = await Service.findOne({
                where: { service_id }
            })

            if (!service) {
                return next(ApiError.notFound('Услуга не найдена'));
            }

            // Сохраняем старое значение фото
            const oldPhoto = service.service_photo;

            // обновляем данные услуги
            await Service.update(
                {
                    // если же знач не задано, то в качестве знач будет текущее из бд
                    service_name: service_name || service.service_name,
                    service_description: service_description || service.service_description,
                    service_price: service_price || service.service_price,
                    service_type_id: service_type_id || service.service_type_id,
                    // старое фото, если новое не загружено
                    service_photo: service_photo ? await savePhoto(service_photo) : oldPhoto 
                },
                {
                    where: { service_id }
                }
            );

            // Удаляем старое фото, если новое фото было загружено
            if (service_photo && oldPhoto) {
                const oldPhotoPath = path.resolve(__dirname, '..', 'static', oldPhoto);
                fs.unlink(oldPhotoPath, (err) => {
                    if (err) {
                        console.error('Ошибка при удалении старого фото:', err);
                    }
                });
            }

            const updatedService = await Service.findOne({ where: { service_id } }); 
            return res.json(updatedService);
        } catch (e) {
            next(ApiError.internal('Ошибка при обновлении услуги: ' + e.message));
        }
    }

    async deleteService(req, res, next) {
        try {
            const { service_id } = req.params;
            const service = await Service.findOne({ where: { service_id } });
            if (service && service.service_photo) {
                const oldPhotoPath = path.resolve(__dirname, '..', 'static', service.service_photo);
                fs.unlinkSync(oldPhotoPath);
            }

            const deletedService = await Service.destroy({ where: { service_id } });

            if (!deletedService) {
                return next(ApiError.notFound('Услуга не найдена'));
            }

            return res.json({ message: 'Услуга успешно удалена' });
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении услуги: ' + e.message));
        }
    }
}

// Функция для сохранения фото
async function savePhoto(service_photo, type = 'services') {
    // генерация рандомных id
    let fileName = uuid.v4() + ".jpg";
    const dirPath = path.resolve(__dirname, '..', 'static', type); // Путь к подпапке

    // Создание подпапки, если она не существует
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        // перемещение файла в нужную подпапку 
        await service_photo.mv(path.join(dirPath, fileName));
    } catch (error) {
        throw new Error('Ошибка при сохранении фото: ' + error.message);
    }
    return path.join(type, fileName); // Возвращаем относительный путь
}

module.exports = new ServiceController();