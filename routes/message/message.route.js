const express = require("express");

const authMiddleware = require('../../middlewares/auth.middleware');

const messageController = require('../../controllers/message/message.controller');

const messageServiceRouter = express.Router();

messageServiceRouter.post('/get-messages',
    authMiddleware.authenticateUser,
    messageController.getMessages
);

messageServiceRouter.post('/send-message',
    authMiddleware.authenticateUser,
    messageController.sendMessage
);


module.exports = messageServiceRouter;