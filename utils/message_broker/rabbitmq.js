const amqplib = require("amqplib");
const { NOTIFICATION_QUEUE, NOTIFICATION_ORDER_QUEUE, NOTIFICATION_USER_QUEUE } = require("../../config/index");
const NotificationService = require("../../services/notification/notification.service");

let channel, connection;

const connectToMessageBroker = async () => {
    try {
        connection = await amqplib.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue(NOTIFICATION_QUEUE);
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: error.status, path: __filename });
        throw error;
    }
}

const consumeMessage = () => {
    try {
        channel.consume(NOTIFICATION_QUEUE, async (msg) => {
            const payload = JSON.parse(msg.content.toString());
            const notificationService = new NotificationService();
            // perform action based on event
            await notificationService.subscribeEvents(payload);
        }, { noAck: true });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    connectToMessageBroker,
    consumeMessage
};