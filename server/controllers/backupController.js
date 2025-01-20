// Импортируем необходимые модули
const { exec } = require('child_process'); // Модуль для выполнения команд в оболочке
const path = require('path'); // Модуль для работы с путями файловой системы
const ApiError = require('../error/ApiError'); // Импорт пользовательского класса ошибок
const fs = require('fs');

// Класс для управления резервными копиями
class BackupController {
    // Метод для создания резервной копии по требованию
    async masterBackup(req, res, next) {
        // Формируем имя файла резервной копии, используя текущую дату и время
        const backupFileName = `manual_backup_${new Date().toISOString().replace(/:/g, '-')}.sql`;

        // Получаем полный путь для файла резервной копии
        const dirPath = path.resolve(__dirname, '..', 'backups'); // Путь к директории резервных копий
        const backupFilePath = path.join(dirPath, backupFileName);

        // Создаем директорию для резервных копий, если она не существует
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Формируем команду для создания резервной копии базы данных
        const command = `/Library/PostgreSQL/17/bin/pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} ${process.env.DB_NAME} -f ${backupFilePath}`;

        // Выполняем команду через exec
        exec(command, { env: { PGPASSWORD: process.env.DB_PASSWORD } }, (error, stdout, stderr) => {
            // Обработка ошибок при выполнении команды
            if (error) {
                console.error(`Ошибка при создании резервной копии по требованию: ${stderr}`);
                return next(ApiError.internal('Ошибка при создании резервной копии по требованию'));
            }
            // Если резервная копия создана успешно
            console.log(`Резервная копия по требованию успешно создана: ${backupFilePath}`);
            return res.json({ message: 'Резервная копия по требованию успешно создана', backupFilePath });
        });
    }
}

// Экспортируем экземпляр класса BackupController
module.exports = new BackupController();