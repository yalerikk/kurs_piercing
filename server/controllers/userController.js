const { User, Client } = require('../models/models');
const ApiError = require('../error/ApiError');

// пакет для хеширования паролей, чтобы не хранить их в бд в чистом виде
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
    В JWT обычно передаются только те данные, которые необходимы для идентификации пользователя 
    и авторизации доступа к ресурсам
*/

const generateJwt = (user_id, user_email, user_role) => {
    return jwt.sign(
        { user_id, user_email, user_role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' } // сколько живет токен
    );
}

class UserController {
    async reg(req, res, next) {
        const { user_name, user_phone, user_email, user_password, user_role } = req.body;

        // Проверка на наличие обязательных полей
        if (!user_name || !user_phone || !user_email || !user_password) {
            return next(ApiError.badRequest('Все поля должны быть заполнены'));
        }

        try {
            // Проверка пользователя с такой же почтой на существование в БД
            const candidateEmail = await User.findOne({ where: { user_email } });
            if (candidateEmail) {
                return next(ApiError.badRequest('Пользователь с такой почтой уже существует'));
            }

            // Проверка на существование пользователя с таким же телефоном
            const candidatePhone = await User.findOne({ where: { user_phone } });
            if (candidatePhone) {
                return next(ApiError.badRequest('Пользователь с таким номером телефона уже существует'));
            }

            // Хеширование пароля
            const hashedPassword = await bcrypt.hash(user_password, 5); // 5 - количество раундов хеширования

            // Создание нового пользователя
            const user = await User.create({
                user_name,
                user_phone,
                user_email,
                user_password: hashedPassword,
                user_role: 0 // Роль по умолчанию (клиент)
            });

            // Проверка роли пользователя перед созданием клиента
            if (user.user_role === 0) {
                await Client.create({ user_id: user.user_id, loyalty_points: 0 });
            }

            // Генерация токена
            const token = generateJwt(user.user_id, user.user_email, user.user_role);

            return res.json({ token });
        } catch (error) {
            console.error('Ошибка при регистрации:', error.message);
            return next(ApiError.internal('Ошибка при регистрации пользователя'));
        }
    }

    async login(req, res, next) {
        const { user_email, user_password } = req.body;

        // Проверка на наличие обязательных полей
        if (!user_email || !user_password) {
            return next(ApiError.badRequest('Все поля должны быть заполнены'));
        }

        try {
            const user = await User.findOne({ where: { user_email } })

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден в системе'));
            }

            // пароль совпадает?
            let comparePassword = bcrypt.compareSync(user_password, user.user_password);
            if (!comparePassword) {
                return next(ApiError.badRequest('Указан неверный пароль'));
            }
            const token = generateJwt(user.user_id, user.user_email, user.user_role);

            return res.json({ token });
        } catch (error) {
            console.error('Ошибка при авторизации:', error.message);
            return next(ApiError.internal('Ошибка при авторизации пользователя'));
        }
    }

    async auth(req, res, next) {
        // грубо говоря перезапись токена
        const token = generateJwt(req.user.user_id, req.user.user_email, req.user.user_role);
        return res.json({ token });
    }
}

module.exports = new UserController();