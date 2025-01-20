const jwt = require('jsonwebtoken');

module.exports = function (user_role) {
    return function(req, res, next) {
        // POST, GET, PUT, DELETE функции интересует, другие - скип
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            // нужно выцепить сам токен, в хедере авторизации
            const token = req.headers.authorization.split(' ')[1] // Bearer (тип) gdxdxhdyxydxr (токен)

            if (!token) {
                return res.status(401).json({ message: "Пользователь не авторизован" });
            }

            // декодируем токен
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (decoded.user_role !== user_role) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Пользователь не авторизован" });
        }
    };
}