// импортируете класс Sequelize из библиотеки sequelize
const {Sequelize} = require('sequelize');

// создание обхекта класса пул
module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
);