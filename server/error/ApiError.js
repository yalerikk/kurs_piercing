class ApiError extends Error{
    constructor(status, message) {
        // вызывает конструктор родительского класса (Error), чтобы правильно инициализировать объект ошибки
        super();
        this.status = status;
        this.message = message;
    }

    // для ошибок, связанных с неверным запросом клиента
    static badRequest(message){
        return new ApiError(400, message);
    }

    // для обозначения внутренних ошибок сервера
    static internal(message) {
        return new ApiError(500, message);
    }

    // доступ к ресурсу запрещен
    static forbidden(message) {
        return new ApiError(403, message);
    }

    // ресурс не найден
    static notFound(message) {
        return new ApiError(404, message);
    }
}

module.exports = ApiError;