const NotificationModel = require("../../models/notification/notification.model");
const httpErrors = require('http-errors');
const { sendEmail } = require("../../helper/services/email.service");
const { USER_QUEUE, NOTIFICATION_USER_QUEUE, USER_SERVICE_BASE_URL } = require("../../config/index");
const amqplib = require("amqplib");
const { makeAxiosGetRequest } = require("../../utils/common");

class NotificationService {

    async createNotification(notificationDetails) {
        const newNotification = new NotificationModel(notificationDetails);
        const savedNotification = await newNotification.save();
        return savedNotification;
    }

    async getNotifications(queryDetails) {
        const { where, skip, pageSize, sort } = queryDetails;
        const notifications = await NotificationModel
            .find(where)
            .skip(skip)
            .limit(pageSize)
            .sort(sort)
            .select("-isDeleted -createdAt -updatedAt")
            .lean()

        return notifications;
    }

    async sendNotificationToEmail(notificationEmail) {
        try {
            await sendEmail(notificationEmail);
        } catch (error) {
            throw error;
        }
    }

    async handleSendNotificationEvent(notificationDetails) {
        try {
            // console.log(notificationDetails);
            const notification = await this.createNotification({
                recipientId: notificationDetails.user.userId,
                type: notificationDetails.type,
                message: notificationDetails.message
            })

            const notificationEmail = {
                recipient: notificationDetails.user.email,
                subject: "Order Confirmed",
                message: notification.message
            }
            await this.sendNotificationToEmail(notificationEmail);
        } catch (error) {
            console.log(error);
        }
    }

    async subscribeEvents(payload) {
        // describe events here.
        const { data, event } = payload;

        console.log(data);

        switch (event) {
            case "SEND_NOTIFICATION":
                await this.handleSendNotificationEvent(data);
                break;

            default:
                break;
        }
    }

}

module.exports = NotificationService;