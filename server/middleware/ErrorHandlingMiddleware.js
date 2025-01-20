const ApiError = require('../error/ApiError');

// экспорт функции миддлвер
module.exports = function(err, req, res, next) {
    console.log(err); // Логируем ошибку

    // Если это экземпляр ApiError, возвращаем его сообщение и статус
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    // Для любых других ошибок возвращаем 500
    return res.status(500).json({ message: "Непредвиденная ошибка!" });
}