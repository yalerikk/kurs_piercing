const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель 'Пользователь'
const User = sequelize.define('user', {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_name: { type: DataTypes.STRING(50), allowNull: false },
    user_phone: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    user_email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    user_password: { type: DataTypes.STRING(255), allowNull: false },
    user_role: { type: DataTypes.INTEGER, defaultValue: 0 } // 0 - клиент, 1 - мастер
}, {
    tableName: 'user' // Явное указание имени таблицы
});

// Модель 'Мастер'
const Master = sequelize.define('master', {
    master_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    master_description: { type: DataTypes.TEXT, allowNull: false }
}, {
    tableName: 'master' // Явное указание имени таблицы
});

// Модель 'Клиент'
const Client = sequelize.define('client', {
    client_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    loyalty_points: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'client' // Явное указание имени таблицы
});

// Модель 'Студия'
const Studio = sequelize.define('studio', {
    studio_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    studio_name: { type: DataTypes.STRING(100), allowNull: false },
    studio_phone: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    work_schedule: { type: DataTypes.STRING(100), allowNull: false } // Формат: "HH:mm-HH:mm"
}, {
    tableName: 'studio' // Явное указание имени таблицы
});

// Модель 'Тип услуги'
const ServiceType = sequelize.define('service_type', {
    service_type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    service_type_name: { type: DataTypes.STRING(20), allowNull: false }
}, {
    tableName: 'service_type' // Явное указание имени таблицы
});

// Модель 'Услуга'
const Service = sequelize.define('service', {
    service_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    service_name: { type: DataTypes.STRING(100), allowNull: false },
    service_description: { type: DataTypes.STRING(180), allowNull: false },
    service_price: { type: DataTypes.INTEGER, allowNull: false },
    service_photo: { type: DataTypes.STRING(255), allowNull: false }
}, {
    tableName: 'service' // Явное указание имени таблицы
});

// Модель 'Расписание'
const Schedule = sequelize.define('schedule', {
    schedule_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    schedule_time: { type: DataTypes.TIME, allowNull: false },
    schedule_date: { type: DataTypes.DATEONLY, allowNull: false },
    schedule_status: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'schedule' // Явное указание имени таблицы
});

// Модель 'Запись'
const Appointment = sequelize.define('appointment', {
    appointment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    appointment_status: { type: DataTypes.STRING(20), allowNull: false },
    appointment_price: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'appointment' // Явное указание имени таблицы
});

// Модель 'Отзыв'
const Review = sequelize.define('review', {
    review_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    review_rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    review_text: { type: DataTypes.STRING(500) }
}, {
    tableName: 'review' // Явное указание имени таблицы
});

// Модель 'Уведомление'
const Notification = sequelize.define('notification', {
    notification_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    notification_title: { type: DataTypes.STRING, allowNull: false },
    notification_text: { type: DataTypes.STRING(255), allowNull: false },
    notification_status: { type: DataTypes.STRING(50), defaultValue: 'непрочитано' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'notification' // Явное указание имени таблицы
});

// Модель 'Портфолио'
const Portfolio = sequelize.define('portfolio', {
    portfolio_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    portfolio_photo: { type: DataTypes.STRING(255) }
}, {
    tableName: 'portfolio' // Явное указание имени таблицы
});

// Определение ассоциаций
// Один пользователь может быть мастером
User.hasOne(Master, { foreignKey: 'user_id' });
Master.belongsTo(User, { foreignKey: 'user_id' });

// Один пользователь может быть клиентом --- soft delete
User.hasOne(Client, { foreignKey: 'user_id' });
Client.belongsTo(User, { foreignKey: 'user_id' });

// Один мастер может иметь много записей (Appointment)
Master.hasMany(Appointment, { foreignKey: 'master_id' });
Appointment.belongsTo(Master, { foreignKey: 'master_id' });

// Один клиент может иметь много записей (Appointment)
Client.hasMany(Appointment, { foreignKey: 'client_id' });
Appointment.belongsTo(Client, { foreignKey: 'client_id' });

// Один тип услуги может иметь много услуг
ServiceType.hasMany(Service, { foreignKey: 'service_type_id' });
Service.belongsTo(ServiceType, { foreignKey: 'service_type_id' });

// Одна услуга может быть связана с множеством записей (Appointment)
Service.hasMany(Appointment, { foreignKey: 'service_id' });
Appointment.belongsTo(Service, { foreignKey: 'service_id' });

// Одно расписание может иметь много записей
Schedule.hasMany(Appointment, { foreignKey: 'schedule_id' });
Appointment.belongsTo(Schedule, { foreignKey: 'schedule_id' });

// Одна студия может иметь много окошек в расписании
Studio.hasMany(Schedule, { foreignKey: 'studio_id' });
Schedule.belongsTo(Studio, { foreignKey: 'studio_id' });

// Один мастер принадлежит одной студии
Studio.hasOne(Master, { foreignKey: 'studio_id' });
Master.belongsTo(Studio, { foreignKey: 'studio_id' });

// Одна запись может иметь только один отзыв --- soft delete
Appointment.hasOne(Review, { foreignKey: 'appointment_id' });
Review.belongsTo(Appointment, { foreignKey: 'appointment_id' });

// Один клиент может оставить много отзывов --- soft delete
Client.hasMany(Review, { foreignKey: 'client_id' });
Review.belongsTo(Client, { foreignKey: 'client_id' });

// Один пользователь может иметь много уведомлений
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Один мастер может иметь много портфолио
Master.hasMany(Portfolio, { foreignKey: 'master_id' });
Portfolio.belongsTo(Master, { foreignKey: 'master_id' });

// Экспорт моделей
module.exports = {
    User,
    Master,
    Client,
    Studio, // +
    ServiceType, // +
    Service, // +
    Schedule,
    Appointment,
    Review,
    Notification,
    Portfolio
};