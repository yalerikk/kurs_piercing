const { Notification, Client, Master, Service, Appointment, Schedule } = require('../models/models');
const ApiError = require('../error/ApiError');

class NotificationController {
    // --- БАЗА ДЛЯ БД ---
    // Создание уведомления
    async createNotification({ notification_text, notification_title, user_id }) {
        if (!notification_text || !notification_title || !user_id) {
            throw new Error('Недостаточно данных для создания уведомления');
        }

        try {
            const notification = await Notification.create({
                user_id,
                notification_text,
                notification_title,
                created_at: new Date()
            });
            return notification; // Возвращаем созданное уведомление
        } catch (error) {
            console.error('Ошибка при создании уведомления:', error.message);
            throw new Error('Ошибка при создании уведомления');
        }
    }

    // Получение уведомлений для пользователя
    async getNotifications(req, res, next) {
        const { user_id } = req.params;
        try {
            const notifications = await Notification.findAll({
                where: { user_id },
                order: [['created_at', 'DESC']]
            });
            const formattedNotifications = notifications.map(notification => ({
                id: notification.notification_id,
                notification_title: notification.notification_title,
                createdAt: notification.created_at,
                notification_status: notification.notification_status === 'непрочитано'
            }));
            return res.json(formattedNotifications);
        } catch (error) {
            console.error('Ошибка при получении уведомлений:', error.message);
            return next(ApiError.internal('Ошибка при получении уведомлений'));
        }
    }

    // Получение конкретного уведомления по ID
    async getNotificationById(req, res, next) {
        const { notification_id } = req.params;
        try {
            const notification = await Notification.findOne({ where: { notification_id } });
            if (!notification) {
                return next(ApiError.notFound('Уведомление не найдено'));
            }

            const { user_id } = req.query;
            if (notification.user_id !== Number(user_id)) {
                return next(ApiError.forbidden('У вас нет доступа к этому уведомлению'));
            }

            await notification.update({ notification_status: 'прочитано' });
            return res.json(notification);
        } catch (error) {
            console.error('Ошибка при получении уведомления:', error.message);
            return next(ApiError.internal('Ошибка при получении уведомления'));
        }
    }

    // --- НОВАЯ ЗАПИСЬ ---
    // Уведомление клиенту о новой записи
    async notifyClientAboutNewAppointment(client_id, service_name, appointment_price, schedule_date, schedule_time) {
        try {
            const client = await Client.findOne({ where: { client_id } });
            if (!client) {
                console.error(`Клиент с ID ${client_id} не найден`);
                return;
            }

            const notificationText = `Вы решили проколоть ${service_name}. Ваша запись стоимостью ${appointment_price}р состоится ${schedule_date} в ${schedule_time}.`;
            const notificationTitle = 'Новая запись!';

            if (client.user_id) {
                const notification = await this.createNotification({
                    notification_text: notificationText,
                    notification_title: notificationTitle,
                    user_id: client.user_id
                });

                console.log(`Уведомление для клиента с ID ${client.user_id} отправлено: ${notificationText}. ID уведомления: ${notification.notification_id}`);
            } else {
                console.error(`У клиента с ID ${client_id} отсутствует user_id`);
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомления клиенту о новой записи:', error.message);
        }
    }

    // Уведомление мастеру о новой записи
    async notifyMasterAboutNewAppointment(master_id, client_name, service_name, appointment_price, schedule_date, schedule_time) {
        try {
            const master = await Master.findOne({ where: { master_id } });
            if (!master) {
                console.error(`Мастер с ID ${master_id} не найден`);
                return;
            }

            const notificationText = `У вас новая запись! Клиент ${client_name} записался на услугу ${service_name} стоимостью ${appointment_price}р на ${schedule_date} в ${schedule_time}.`;
            const notificationTitle = 'Новая запись!';

            if (master.user_id) {
                const notification = await this.createNotification({
                    notification_text: notificationText,
                    notification_title: notificationTitle,
                    user_id: master.user_id
                });

                console.log(`Уведомление для мастера с ID ${master.user_id} отправлено: ${notificationText}. ID уведомления: ${notification.notification_id}`);
            } else {
                console.error(`У мастера с ID ${master_id} отсутствует user_id`);
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомления мастеру о новой записи:', error.message);
        }
    }

    // --- ОТМЕНА ЗАПИСИ ---
    // Уведомление клиенту об отмене записи
    async notifyClientAboutAppointmentCancellation(client_id, service_name, appointment_price, schedule_date, schedule_time) {
        try {
            const client = await Client.findOne({ where: { client_id } });
            if (!client) {
                console.error(`Клиент с ID ${client_id} не найден`);
                return;
            }

            const notificationText = `Ваша запись на услугу ${service_name} стоимостью ${appointment_price}р, запланированная на ${schedule_date} в ${schedule_time}, была отменена.`;
            const notificationTitle = 'Запись отменена';

            if (client.user_id) {
                const notification = await this.createNotification({
                    notification_text: notificationText,
                    notification_title: notificationTitle,
                    user_id: client.user_id
                });

                console.log(`Уведомление для клиента с ID ${client.user_id} отправлено: ${notificationText}. ID уведомления: ${notification.notification_id}`);
            } else {
                console.error(`У клиента с ID ${client_id} отсутствует user_id`);
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомления клиенту об отмене записи:', error.message);
        }
    }

    // Уведомление мастеру об отмене записи
    async notifyMasterAboutAppointmentCancellation(master_id, client_name, service_name, appointment_price, schedule_date, schedule_time) {
        try {
            const master = await Master.findOne({ where: { master_id } });
            if (!master) {
                console.error(`Мастер с ID ${master_id} не найден`);
                return;
            }

            const notificationText = `Клиент ${client_name} отменил запись на услугу ${service_name} стоимостью ${appointment_price}р, запланированную на ${schedule_date} в ${schedule_time}.`;
            const notificationTitle = 'Запись отменена';

            if (master.user_id) {
                const notification = await this.createNotification({
                    notification_text: notificationText,
                    notification_title: notificationTitle,
                    user_id: master.user_id
                });

                console.log(`Уведомление для мастера с ID ${master.user_id} отправлено: ${notificationText}. ID уведомления: ${notification.notification_id}`);
            } else {
                console.error(`У мастера с ID ${master_id} отсутствует user_id`);
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомления мастеру об отмене записи:', error.message);
        }
    }

    // --- НАЧИСЛЕН БАЛЛ ---
    async notifyClientAboutLoyaltyPoint(client_id, schedule_date, schedule_time) {
        const notificationTitle = 'Вы получили балл лояльности!';
        const notificationText = `Поздравляем с новым проколом, Вам очень идет! Рады также сообщить что Вам начислен 1 балл лояльности за ваше посещение, запланированное на ${schedule_date} в ${schedule_time}. Спасибо что выбрали меня. Как воспользоваться баллами лояльности можете узнать в разделе "История проколов". Не забудьте поделиться Вашими впечатлениями в отзывах!`;

        // Создание уведомления в базе данных
        const notification = await Notification.create({
            notification_title: notificationTitle,
            notification_text: notificationText,
            notification_status: 'не прочитано',
            user_id: client_id
        });

        console.log(`Уведомление для клиента с ID ${client_id} отправлено: ${notificationText}. ID уведомления: ${notification.notification_id}`);
    }

    // Уведомление клиенту о том, что отзыв успешно оставлен
    async notifyClientAboutNewReview(client_id) {
        try {
            const client = await Client.findOne({ where: { client_id } });
            if (!client) {
                console.error(`Клиент с ID ${client_id} не найден`);
                return;
            }

            const notificationText = `Спасибо за ваш отзыв! Мы ценим ваше мнение и надеемся увидеть вас снова!`;
            const notificationTitle = 'Отзыв успешно оставлен';

            if (client.user_id) {
                const notification = await this.createNotification({
                    notification_text: notificationText,
                    notification_title: notificationTitle,
                    user_id: client.user_id
                });

                console.log(`Уведомление для клиента с ID ${client.user_id} отправлено: ${notificationText}. ID уведомления: ${notification.notification_id}`);
            } else {
                console.error(`У клиента с ID ${client_id} отсутствует user_id`);
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомления клиенту о новом отзыве:', error.message);
        }
    }
}

module.exports = new NotificationController();