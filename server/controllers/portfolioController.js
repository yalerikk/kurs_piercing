// генерация рандомных id, к-е не будут повторяться
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const { Portfolio, Master } = require('../models/models');
const ApiError = require('../error/ApiError');

class PortfolioController {
    async createPortfolioItem(req, res, next) {
        try {
            const { portfolio_photo } = req.files;

            if (!portfolio_photo) {
                return res.status(400).json({ message: 'Фото не загружено' });
            }

            const fileName = await savePhoto(portfolio_photo, 'portfolio');

            const portfolioItem = await Portfolio.create({
                portfolio_photo: fileName,
                master_id: 1 
            });
            return res.status(201).json(portfolioItem);
        } catch (e) {
            next(ApiError.internal('Ошибка при создании элемента портфолио: ' + e.message));
        }
    }

    async getPortfolio(req, res, next) {
        try {
            const portfolioItems = await Portfolio.findAll();
            return res.json(portfolioItems);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении портфолио: ' + e.message));
        }
    }

    async getPortfolioItem(req, res, next) {
        try {
            const { portfolio_id } = req.params;
            const portfolioItem = await Portfolio.findOne({ where: { portfolio_id } });

            if (!portfolioItem) {
                return res.status(404).json({ message: 'Элемент портфолио не найден' });
            }

            return res.json(portfolioItem);
        } catch (e) {
            next(ApiError.internal('Ошибка при получении элемента портфолио: ' + e.message));
        }
    }

    async deletePortfolioItem(req, res, next) {
        try {
            const { portfolio_id } = req.params;
            const portfolioItem = await Portfolio.findOne({ where: { portfolio_id } });

            if (portfolioItem && portfolioItem.portfolio_photo) {
                const oldPhotoPath = path.resolve(__dirname, '..', 'static', portfolioItem.portfolio_photo);
                fs.unlinkSync(oldPhotoPath); // Удаляем файл фото
            }

            const deletedPortfolioItem = await Portfolio.destroy({ where: { portfolio_id } });

            if (!deletedPortfolioItem) {
                return res.status(404).json({ message: 'Элемент портфолио не найден' });
            }

            return res.json({ message: 'Элемент портфолио успешно удален' });
        } catch (e) {
            next(ApiError.badRequest('Ошибка при удалении элемента портфолио: ' + e.message));
        }
    }

    async copyAllPhotosFromService(req, res, next) {
        try {
            const sourceDir = path.join(__dirname, '..', 'static', 'services');
            const destinationDir = path.join(__dirname, '..', 'static', 'portfolio');

            // Создаем директорию назначения, если её нет
            if (!fs.existsSync(destinationDir)) {
                fs.mkdirSync(destinationDir, { recursive: true });
            }

            // Читаем все файлы из директории services
            const files = fs.readdirSync(sourceDir);
            let copiedFiles = [];

            for (const file of files) {
                const sourceFilePath = path.join(sourceDir, file);
                const destinationFilePath = path.join(destinationDir, file);

                // Проверяем, существует ли файл в папке portfolio
                if (!fs.existsSync(destinationFilePath)) {
                    fs.copyFileSync(sourceFilePath, destinationFilePath); // Копируем файл
                    copiedFiles.push(file);

                    // Создаем запись в таблице Portfolio
                    await Portfolio.create({
                        portfolio_photo: path.join('portfolio', file),
                        master_id: 1 
                    });
                }
            }

            return res.json({ message: 'Фотографии успешно скопированы в портфолио', copiedFiles });
        } catch (e) {
            next(ApiError.badRequest('Ошибка при копировании фото: ' + e.message));
        }
    }
}

// Функция для сохранения фото
async function savePhoto(photo, type = 'portfolio') {
    // генерация рандомных id
    const fileName = uuid.v4() + ".jpg";
    const dirPath = path.resolve(__dirname, '..', 'static', type); // Путь к подпапке

    // Создание подпапки, если она не существует
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
        // перемещение файла в нужную подпапку 
        await photo.mv(path.join(dirPath, fileName));
    } catch (error) {
        throw new Error('Ошибка при сохранении фото: ' + error.message);
    }
    return path.join(type, fileName); // Возвращаем относительный путь
}

module.exports = new PortfolioController();