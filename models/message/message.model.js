const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('Message', messageSchema);