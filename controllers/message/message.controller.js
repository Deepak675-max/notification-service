const joiMessage = require('../../utils/joi/message/message.joi_validation.js');
const { logger } = require("../../utils/error_logger/winston.js");
const MessageService = require("../../services/message/message.service.js");
const { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER, APP_BACKEND_BASE_URL } = require("../../config/index.js");

const messageService = new MessageService();

const getMessages = async (req, res, next) => {
    try {
        const querySchema = await joiMessage.getMessageSchema.validateAsync(req.body);
        const page = querySchema.metaData?.offset || DEFAULT_OFFSET;
        const pageSize = querySchema.metaData?.limit || DEFAULT_LIMIT;
        const sort = {};
        sort[DEFAULT_SORT_BY] = DEFAULT_SORT_ORDER;

        const queryDetails = {
            skip: (page - 1) * pageSize,
            limit: pageSize,
            sort: sort,
            where: {}
        };

        if (querySchema.senderId) {
            queryDetails.where.senderId = querySchema.senderId;
        }
        if (querySchema.receiverId) {
            queryDetails.where.receiverId = querySchema.receiverId;
        }
        if (querySchema.status) {
            queryDetails.where.status = querySchema.status;
        }

        if (querySchema.search) {
            queryDetails.where.$or = [
                { message: { $regex: searchValue } },
                { status: { $regex: searchValue } }
            ];
        }

        const messages = await messageService.getMessages(queryDetails);

        // Send the response
        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    messages: messages,
                    message: "Messages fetched successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const sendMessage = async (req, res, next) => {
    try {
        const messageDetails = await joiMessage.sendMessageSchema.validateAsync(req.body);
        await messageService.sendMessage(messageDetails);
        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Messages Send successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

module.exports = {
    getMessages,
    sendMessage
}