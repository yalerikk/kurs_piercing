const { Appointment, User, Client, Service, Schedule, Review, ServiceType, Master } = require('../models/models');
const ApiError = require('../error/ApiError');
const notificationController = require('./notificationController'); // Импортируем контроллер уведомлений

class AppointmentController {
    // флаг use_loyalty_points, указывающий, хочет ли клиент использовать свои баллы
    async createAppointment(req, res, next) {
        const { client_id, service_id, schedule_id, use_loyalty_points } = req.body;

        // Проверка на наличие обязательных полей
        if (!client_id || !service_id || !schedule_id) {
            return next(ApiError.badRequest('Недостаточно данных для создания записи'));
        }

        let slot;

        try {
            // 1. Находим выбранный слот
            slot = await Schedule.findOne({ where: { schedule_id, schedule_status: true } });
            if (!slot) return next(ApiError.notFound('Слот не найден или занят'));

            // 2. Проверяем, не прошла ли дата
            const appointmentDateTime = new Date(`${slot.schedule_date} ${slot.schedule_time}`);
            const now = new Date();

            if (appointmentDateTime < now) {
                return next(ApiError.badRequest('Нельзя записаться на прошедшее время'));
            }

            // 3. Находим услугу
            const service = await Service.findOne({ where: { service_id } });
            if (!service) return next(ApiError.notFound('Услуга не найдена'));

            // 3.1 Находим тип услуги по service_type_id
            const serviceType = await ServiceType.findOne({ where: { service_type_id: service.service_type_id } });
            if (!serviceType) return next(ApiError.notFound('Тип услуги не найден'));

            // 4. Получаем информацию о клиенте, включая loyalty_points
            const client = await Client.findOne({
                where: { client_id },
                include: [{ model: User, attributes: ['user_name'] }] // Включаем User для получения имени
            });
            if (!client) return next(ApiError.notFound('Клиент не найден'));

            // 5. Логика для использования баллов
            let discount = 0;
            if (use_loyalty_points && client.loyalty_points > 0) {
                discount = Math.min(client.loyalty_points, 10);
                await client.update({ loyalty_points: client.loyalty_points - discount });
            }

            // 6. Вычисляем финальную стоимость
            const finalPrice = service.service_price - discount;

            // 7. Создаем запись
            const newAppointment = await Appointment.create({
                master_id: 1, // Убедитесь, что master_id корректен
                client_id,
                service_id,
                schedule_id,
                appointment_status: 'активна',
                appointment_price: finalPrice
            });

            // 8. Обновляем статус слота только после успешного создания записи
            await slot.update({ schedule_status: false });

            // Отправка уведомлений
            await notificationController.notifyClientAboutNewAppointment(client.client_id, service.service_name, finalPrice, slot.schedule_date, slot.schedule_time);
            await notificationController.notifyMasterAboutNewAppointment(newAppointment.master_id, client.user.user_name, service.service_name, finalPrice, slot.schedule_date, slot.schedule_time);

            // 12. Установка таймера для автоматической смены статуса через 5 минут после времени записи
            const appointmentTime = new Date(`${slot.schedule_date} ${slot.schedule_time}`);
            const fiveMinutesLater = new Date(appointmentTime.getTime() + 5 * 60 * 1000); // 5 минут после времени записи

            setTimeout(async () => {
                const appointment = await Appointment.findOne({ where: { appointment_id: newAppointment.appointment_id } });
                if (appointment && appointment.appointment_status === 'активна') {
                    await appointment.update({ appointment_status: 'завершена' });
                    const updatedClient = await Client.findOne({ where: { client_id: appointment.client_id } });

                    // 11. Добавляем +1 балл лояльности, если тип услуги не "Другое"
                    if (updatedClient && serviceType.service_type_name !== 'Другое') {
                        await client.update({ loyalty_points: client.loyalty_points + 1 });
                        await notificationController.notifyClientAboutLoyaltyPoint(client.client_id, slot.schedule_date, slot.schedule_time);
                    }
                    console.log(`Запись с ID ${newAppointment.appointment_id} завершена и клиент уведомлён.`);
                }
            }, fiveMinutesLater - now.getTime()); // Задержка до времени завершения

            // 13. Возвращаем созданную запись
            return res.json(newAppointment);
        } catch (error) {
            console.error('Ошибка при создании записи:', error);
            if (slot) {
                try {
                    await slot.update({ schedule_status: true });
                } catch (updateError) {
                    console.error('Ошибка при обновлении статуса слота:', updateError.message);
                }
            }
            return next(ApiError.internal('Ошибка при создании записи'));
        }
    }

    // просмотр записи у мастера
    async getAppointmentDetails(req, res, next) {
        const { appointment_id } = req.params; // ID слота
        try {
            const appointment = await Appointment.findOne({
                where: { appointment_id },
                include: [
                    {
                        model: Client,
                        include: [
                            {
                                model: User,
                                attributes: ['user_name']
                            }
                        ],
                        attributes: ['client_id']
                    },
                    {
                        model: Service,
                        attributes: ['service_name']
                    }
                ],
                attributes: ['appointment_price', 'appointment_status']
            });

            if (!appointment) return next(ApiError.notFound('Запись не найдена'));

            return res.json(appointment);
        } catch (error) {
            console.error('Ошибка при получении записи:', error.message);
            return next(ApiError.internal('Ошибка при получении записи'));
        }
    }

    // текущие записи клиента
    async getCurrentAppointments(req, res, next) {
        const { client_id } = req.params; // ID клиента
        console.log('Получение текущих записей для клиента с ID:', client_id);
        try {
            const currentAppointments = await Appointment.findAll({
                where: { client_id, appointment_status: 'активна' },
                include: [
                    {
                        model: Service,
                        attributes: ['service_name']
                    },
                    {
                        model: Schedule,
                        attributes: ['schedule_time', 'schedule_date']
                    }
                ],
                attributes: ['appointment_price', 'appointment_id']
            });

            console.log('Текущие записи:', currentAppointments); // Логирование текущих записей

            if (currentAppointments.length === 0) {
                return res.json({ message: 'У вас нет текущих записей' });
            }

            const formattedAppointments = currentAppointments.map(appointment => ({
                appointment_date: `${appointment.schedule.schedule_date} ${appointment.schedule.schedule_time}`,
                service_name: appointment.service.service_name,
                appointment_price: appointment.appointment_price
            }));

            return res.json(formattedAppointments);
        } catch (error) {
            console.error('Ошибка при получении текущих записей:', error.message);
            return next(ApiError.internal('Ошибка при получении текущих записей'));
        }
    }

    // история записей клиента
    async getClientHistory(req, res, next) {
        const { client_id } = req.params; // ID клиента
        console.log('Запрос на получение истории для клиента с ID:', req.params.client_id);
        try {
            // Извлекаем клиента вместе с его атрибутами
            const client = await Client.findOne({
                where: { client_id },
                attributes: ['loyalty_points']
            });

            if (!client) {
                return res.status(404).json({ message: 'Клиент не найден' });
            }

            const appointments = await Appointment.findAll({
                where: { client_id, appointment_status: 'завершена' },
                include: [
                    {
                        model: Service,
                        attributes: ['service_name']
                    },
                    {
                        model: Schedule,
                        attributes: ['schedule_time', 'schedule_date']
                    }
                ],
                attributes: ['appointment_price']
            });

            if (appointments.length === 0) {
                return res.json({ message: 'Ваша история пока пуста' });
            }

            const formattedAppointments = appointments.map(appointment => ({
                appointment_date: `${appointment.schedule.schedule_date} ${appointment.schedule.schedule_time}`,
                service_name: appointment.service.service_name,
                appointment_price: appointment.appointment_price
            }));

            return res.json({ appointments: formattedAppointments, loyaltyPoints: client.loyalty_points });
        } catch (error) {
            console.error('Ошибка при получении истории услуг:', error.message);
            return next(ApiError.internal('Ошибка при получении истории услуг'));
        }
    }

    // отмена клиентом его записи
    async cancelAppointment(req, res, next) {
        const { appointment_id } = req.params; // ID записи
        try {
            const appointment = await Appointment.findOne({ where: { appointment_id } });

            // Проверка на наличие записи
            if (!appointment) return next(ApiError.notFound('Запись не найдена'));

            // Обновляем статус записи
            await appointment.update({ appointment_status: 'отменена' });

            // Обновляем статус слота
            const slot = await Schedule.findOne({ where: { schedule_id: appointment.schedule_id } });
            if (slot) {
                await slot.update({ schedule_status: true }); // Возвращаем слот в свободное состояние
            }

            // Получаем информацию о клиенте
            const client = await Client.findOne({
                where: { client_id: appointment.client_id },
                include: [{ model: User, attributes: ['user_name'] }] // Включаем User для получения имени
            });
            if (!client) {
                console.error(`Клиент с ID ${appointment.client_id} не найден`);
                return next(ApiError.notFound('Клиент не найден'));
            }

            // Получаем информацию об услуге
            const service = await Service.findOne({ where: { service_id: appointment.service_id } });
            if (!service) {
                console.error(`Услуга с ID ${appointment.service_id} не найдена`);
                return next(ApiError.notFound('Услуга не найдена'));
            }

            // Уведомление клиенту об отмене записи
            await notificationController.notifyClientAboutAppointmentCancellation(
                appointment.client_id,
                service.service_name,
                appointment.appointment_price,
                slot.schedule_date,
                slot.schedule_time
            );
            await notificationController.notifyMasterAboutAppointmentCancellation(
                appointment.master_id,
                client.user.user_name,  // Получаем имя клиента
                service.service_name,
                appointment.appointment_price,
                slot.schedule_date,
                slot.schedule_time
            );

            // Удаление записи через час
            setTimeout(async () => {
                await Appointment.destroy({ where: { appointment_id } });
                console.log(`Запись с ID ${appointment_id} была удалена через час после отмены.`);
            }, 60 * 60 * 1000); // час в миллисекундах

            return res.json({ message: 'Запись отменена' });
        } catch (error) {
            console.error('Ошибка при отмене записи:', error.message);
            return next(ApiError.internal('Ошибка при отмене записи'));
        }
    }

    async getStatistics(req, res, next) {
        try {
            // Общее количество завершённых записей
            const totalCompletedAppointments = await Appointment.count({
                where: { appointment_status: 'завершена' }
            });

            // Общий доход только для завершённых записей
            const totalRevenue = await Appointment.sum('appointment_price', {
                where: { appointment_status: 'завершена' }
            }) || 0;

            // Общее количество отзывов
            const totalReviews = await Review.count() || 0;

            // Просто возвращаем базовые показатели
            return res.json({
                totalCompletedAppointments,
                totalRevenue,
                totalReviews
            });
        } catch (error) {
            console.error('Ошибка при получении статистики:', error.message);
            return next(ApiError.internal('Ошибка при получении статистики'));
        }
    }
}

module.exports = new AppointmentController();