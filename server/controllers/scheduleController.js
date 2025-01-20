const { Schedule, Studio } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class ScheduleController {
    // Генерация расписания
    async generateSchedule(req, res, next) {
        try {
            const studio = await Studio.findOne({ where: { studio_id: 1 } });
            if (!studio) {
                console.error('Студия не найдена');
                return next(ApiError.notFound('Студия не найдена'));
            }

            console.log('Найдена студия:', studio);

            const today = new Date();
            const startDate = today.getDate() >= 15
                ? new Date(today.getFullYear(), today.getMonth() + 1, 1)
                : new Date(today.getFullYear(), today.getMonth(), 1);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Последний день месяца

            // Проверяем, существует ли расписание для данного месяца
            const existingSlots = await Schedule.findAll({
                where: {
                    schedule_date: {
                        [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
                    },
                    studio_id: 1
                }
            });

            if (existingSlots.length > 0) {
                return res.json({ message: 'Расписание уже существует для этого месяца' });
            }

            // Разбиваем время работы
            const [workStartStr, workEndStr] = studio.work_schedule.split('-');
            const [startHours, startMinutes] = workStartStr.split(':').map(Number);
            const [endHours, endMinutes] = workEndStr.split(':').map(Number);

            const workStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startHours, startMinutes);
            const workEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), endHours, endMinutes);

            // Проверяем, что время работы корректное
            if (workStart >= workEnd) {
                console.error('Некорректное время работы:', workStart, workEnd);
                return next(ApiError.badRequest('Некорректное время работы'));
            }

            console.log('Время работы:', workStart, workEnd);

            const slots = [];
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                for (let hour = workStart.getHours(); hour <= workEnd.getHours(); hour++) {
                    slots.push({
                        schedule_time: `${hour.toString().padStart(2, '0')}:00`,
                        schedule_date: date.toISOString().split('T')[0], // Формат YYYY-MM-DD
                        schedule_status: true, // По умолчанию все свободные
                        studio_id: 1 // Сохранение ID студии для связи
                    });
                }
            }

            console.log('Слоты для создания:', slots);

            await Schedule.bulkCreate(slots);
            return res.json({ message: 'Расписание сгенерировано' });
        } catch (error) {
            console.error('Ошибка при генерации расписания:', error);
            return next(ApiError.internal('Ошибка при генерации расписания'));
        }
    }

    // Просмотр расписания для клиента
    async viewClientSchedule(req, res, next) {
        const { date } = req.params; // Получаем дату из параметров маршрута
        if (!date) {
            return next(ApiError.badRequest('Дата обязательна'));
        }

        try {
            const slots = await Schedule.findAll({
                where: {
                    schedule_date: date,
                    schedule_status: true,
                    studio_id: 1 // Учитываем студию
                }
            });
            return res.json(slots);
        } catch (error) {
            console.error('Ошибка при получении расписания:', error); // Логируем ошибку
            return next(ApiError.internal('Ошибка при получении расписания'));
        }
    }

    async viewMasterSchedule(req, res, next) {
        const { date } = req.params; // Получаем дату из параметров маршрута
        if (!date) {
            return next(ApiError.badRequest('Дата обязательна'));
        }

        try {
            const slots = await Schedule.findAll({
                where: {
                    schedule_date: date,
                    studio_id: 1 // Учитываем студию
                }
            });
            return res.json(slots);
        } catch (error) {
            console.error('Ошибка при получении расписания:', error); // Логируем ошибку
            return next(ApiError.internal('Ошибка при получении расписания'));
        }
    }

    // Удаление расписания
    async deleteSchedule(req, res, next) {
        const { schedule_id } = req.params; // ID выбранного слота
        try {
            // Проверяем, что данные предоставлены
            if (!schedule_id) {
                return next(ApiError.badRequest('ID обязателен'));
            }

            const slot = await Schedule.findOne({ where: { schedule_id } });
            if (!slot) return next(ApiError.notFound('Слот не найден'));
            
            // Проверяем статус слота. Если он занят, не удаляем его.
            if (!slot.schedule_status) {
                return next(ApiError.badRequest('Невозможно удалить занятый слот'));
            }

            await slot.destroy();
            return res.json({ message: 'Слот удалён' });
        } catch (error) {
            console.error('Ошибка при удалении слота:', error.message); // Логируем сообщение об ошибке
            console.error('Стек вызовов:', error.stack); // Логируем стек вызовов
            return next(ApiError.internal('Ошибка при удалении слота'));
        }
    }

    // Удаление слотов по дате
    async deleteSlotsByDate(req, res, next) {
        const { schedule_date } = req.params; // Дата для удаления слотов
        try {
            // Проверяем, что дата предоставлена
            if (!schedule_date) {
                return next(ApiError.badRequest('Дата обязательна'));
            }

            // Проверяем, есть ли занятые слоты на указанную дату
            const occupiedSlots = await Schedule.findAll({
                where: {
                    schedule_date: schedule_date,
                    studio_id: 1,
                    schedule_status: false // Занятые слоты
                }
            });

            // Если есть занятые слоты, выводим сообщение, но продолжаем выполнение
            if (occupiedSlots.length > 0) {
                console.log('Невозможно удалить слоты, так как они заняты клиентами. Свободные слоты удалятся');
                res.json({ message: 'Невозможно удалить слоты, так как они заняты клиентами. Свободные слоты будут удалены.' });
            }

            // Ищем свободные слоты по указанной дате и студии с ID 1
            const freeSlots = await Schedule.findAll({
                where: {
                    schedule_date: schedule_date,
                    studio_id: 1, // Студия с ID 1
                    schedule_status: true // Только свободные слоты
                }
            });

            // Проверяем, найдены ли свободные слоты
            if (freeSlots.length === 0) {
                return res.json({ message: 'Нет свободных слотов для удаления' });
            }

            // Удаляем найденные свободные слоты
            const deletedCount = await Schedule.destroy({
                where: {
                    schedule_date: schedule_date,
                    studio_id: 1,
                    schedule_status: true // Удаляются только свободные
                }
            });

            return res.json({ message: `Удалено ${deletedCount} свободных слотов` });
        } catch (error) {
            console.error('Ошибка при удалении слотов:', error.message);
            console.error('Стек вызовов:', error.stack);
            return next(ApiError.internal('Ошибка при удалении слотов'));
        }
    }
}

module.exports = new ScheduleController();