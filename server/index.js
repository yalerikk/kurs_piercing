// импорт конф данных порта
require('dotenv').config();

// базовая конфигурация для приема запросов, импорт экспресса
const express = require('express');

// для запросов с браузера
const cors = require('cors');
// для фоток
const fileUpload = require('express-fileupload');
const path = require('path');
// модуль для работы с файловой системой
const fs = require('fs');

// миддлвер
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
// роутеры
const router = require('./routes/mainRouter');

// импорт для бд
const sequelize = require('./db');
const models = require('./models/models');

const PORT = process.env.PORT || 3000;

// из экспресса создаем сервер
const app = express();
app.use(cors());
// создаем маршрут по которому сможем отправлять запросы
app.use(express.json());
// фоточки
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
// Подключение маршрутов
app.use('/api', router);

// обработка ошибок, последний Middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).json({message: 'working!'})
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Обновление существующих таблиц

        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start();