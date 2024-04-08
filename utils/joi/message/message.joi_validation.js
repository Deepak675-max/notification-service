const joi = require('joi');

const sendMessageSchema = joi.object({
    senderId: joi.string().trim().hex().length(24).required(),
    receiverId: joi.string().trim().hex().length(24).required(),
    message: joi.string().trim().required(),
    status: joi.string().trim().optional().default("Unread"),
});


module.exports = {
    sendMessageSchema
};