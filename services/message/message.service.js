const MessageModel = require("../../models/message/message.model");
const amqplib = require("amqplib");

class MessageService {

    async createMessage(messageDetails) {
        const newMessage = new MessageModel(messageDetails);
        const savedMessage = await newMessage.save();
        return newMessage;
    }

    async sendMessage(messageDetails) {
        const { senderId, receiverId, message } = messageDetails;
        try {
            const connection = await amqplib.connect('amqp://localhost');
            const channel = await connection.createChannel();
            const exchange = 'direct_exchange';
            await channel.assertExchange(exchange, 'direct', { durable: false });

            // Send message to RabbitMQ with the recipient's ID as the routing key
            const messageData = { senderId, receiverId, message, timestamp: new Date() };
            channel.publish(exchange, receiverId, Buffer.from(JSON.stringify(messageData)));
            console.log("Message sent:", messageData);
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
            throw error;
        }
    }

    async getMessages(queryDetails) {
        const { where, skip, pageSize, sort } = queryDetails;
        const messages = await MessageModel
            .find(where)
            .skip(skip)
            .limit(pageSize)
            .sort(sort)
            .select("-isDeleted -createdAt -updatedAt")
            .lean()

        return messages;
    }
}

module.exports = MessageService