const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: ["Read", "Unread"],
        default: "Unread"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema);