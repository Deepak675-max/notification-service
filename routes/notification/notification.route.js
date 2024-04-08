const express = require("express");

const authMiddleware = require('../../middlewares/auth.middleware');

const notificationController = require('../../controllers/notification/notification.controller');

const notificationServiceRouter = express.Router();

notificationServiceRouter.post('/get-notifications',
    authMiddleware.authenticateUser,
    notificationController.getNotifications
);


module.exports = notificationServiceRouter;