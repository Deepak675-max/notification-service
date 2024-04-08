const joiProduct = require('../../utils/joi/notification/notification.joi_validation.js');
const { logger } = require("../../utils/error_logger/winston.js");
const NotificationService = require("../../services/notification/notification.service.js");
const { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER, APP_BACKEND_BASE_URL } = require("../../config/index.js");

const notificationService = new NotificationService();

const getNotifications = async (req, res, next) => {
    try {
        const querySchema = await joiProduct.getProductsSchema.validateAsync(req.body);
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

        if (querySchema.category) {
            queryDetails.where.type = querySchema.type;
        }
        if (querySchema.status) {
            queryDetails.where.status = querySchema.status;
        }

        if (querySchema.search) {
            queryDetails.where.$or = [
                { message: { $regex: searchValue } },
                { type: { $regex: searchValue } }
            ];
        }

        const notifications = await notificationService.getNotifications(queryDetails);

        // Send the response
        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    notifications: notifications,
                    message: "Notification fetched successfully",
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
    getNotifications
}