const Router = require('express');
const router = new Router();

// все роутеры
const userRouter = require('./userRouter');
const masterRouter = require('./masterRouter');
const clientRouter = require('./clientRouter');

const studioRouter = require('./studioRouter');
const serviceRouter = require('./serviceRouter');
const serviceTypeRouter = require('./serviceTypeRouter');
const scheduleRouter = require('./scheduleRouter');
const appointmentRouter = require('./appointmentRouter');

const reviewRouter = require('./reviewRouter');
const notificationRouter = require('./notificationRouter');
const portfolioRouter = require('./portfolioRouter');

const backupRouter = require('./backupRouter');

// все маршруты
router.use('/user', userRouter);
router.use('/master', masterRouter);
router.use('/client', clientRouter);

router.use('/studio', studioRouter);
router.use('/service', serviceRouter);
router.use('/service_type', serviceTypeRouter);
router.use('/schedule', scheduleRouter);
router.use('/appointment', appointmentRouter);

router.use('/review', reviewRouter);
router.use('/notification', notificationRouter);
router.use('/portfolio', portfolioRouter);

router.use('/backup', backupRouter);

module.exports = router;