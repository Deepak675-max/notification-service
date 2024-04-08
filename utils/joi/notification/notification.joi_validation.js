const joi = require('joi');

const createNotificationSchema = joi.object({
    recipientId: joi.string().trim().hex().length(24).required(),
    type: joi.string().trim().required(),
    message: joi.string().trim().required(),
    status: joi.string().trim().optional().default("Unread"),
});

const getNotifications = joi.object({
    type: joi.string().trim().optional().default(null),
    status: joi.string().trim().optional().default(null),
    search: joi.string().trim().optional().allow('').default(null),
    metaData: joi.object({
        sortBy: joi.string().trim().optional().default(null),
        sortOn: joi.string().trim().optional().default(null),
        offset: joi.number().optional().default(null),
        limit: joi.number().optional().default(null),
    }).optional().default(null)
})

module.exports = {
    createNotificationSchema,
    getNotifications
};
