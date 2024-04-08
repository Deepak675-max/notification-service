const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'messaging_db';

async function connectMongoDB() {
    const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function consumeMessagesForBuyer(channel, db, buyerId) {
    const exchange = 'direct_exchange';
    await channel.assertExchange(exchange, 'direct', { durable: false });

    const queue = `messages_buyer_${buyerId}`;
    await channel.assertQueue(queue, { durable: false });

    // Bind the queue to the exchange with the buyer's ID as the routing key
    await channel.bindQueue(queue, exchange, buyerId);

    console.log(`Waiting for messages for buyer ${buyerId}`);

    channel.consume(queue, async (msg) => {
        const messageData = JSON.parse(msg.content.toString());
        console.log(`Received message for buyer ${buyerId}:`, messageData);
        await storeMessageInMongoDB(db, messageData);
    }, {
        noAck: true
    });
}

async function consumeMessagesForSeller(channel, db, sellerId) {
    const exchange = 'direct_exchange';
    await channel.assertExchange(exchange, 'direct', { durable: false });

    const queue = `messages_seller_${sellerId}`;
    await channel.assertQueue(queue, { durable: false });

    // Bind the queue to the exchange with the seller's ID as the routing key
    await channel.bindQueue(queue, exchange, sellerId);

    console.log(`Waiting for messages for seller ${sellerId}`);

    channel.consume(queue, async (msg) => {
        const messageData = JSON.parse(msg.content.toString());
        console.log(`Received message for seller ${sellerId}:`, messageData);
        await storeMessageInMongoDB(db, messageData);
    }, {
        noAck: true
    });
}

async function setupBuyerAndSellerQueues(channel, db) {
    // Assuming you have a list of buyer IDs and seller IDs
    const buyerIds = ['buyer1', 'buyer2'];
    const sellerIds = ['seller1', 'seller2'];

    for (const buyerId of buyerIds) {
        await consumeMessagesForBuyer(channel, db, buyerId);
    }

    for (const sellerId of sellerIds) {
        await consumeMessagesForSeller(channel, db, sellerId);
    }
}

async function startConsumers(db) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await setupBuyerAndSellerQueues(channel, db);
    } catch (error) {
        console.error('Error starting consumers:', error);
    }
}

async function storeMessageInMongoDB(db, messageData) {
    const collection = db.collection('messages');
    try {
        await collection.insertOne(messageData);
        console.log('Message stored in MongoDB:', messageData);
    } catch (error) {
        console.error('Error storing message in MongoDB:', error);
    }
}

app.use(bodyParser.json());

app.post('/send-message', async (req, res) => {
    const { senderId, recipientId, message } = req.body;

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'direct_exchange';
        await channel.assertExchange(exchange, 'direct', { durable: false });

        // Send message to RabbitMQ with the recipient's ID as the routing key
        const messageData = { senderId, recipientId, message, timestamp: new Date() };
        channel.publish(exchange, recipientId, Buffer.from(JSON.stringify(messageData)));
        console.log("Message sent:", messageData);

        res.status(200).send('Message sent to RabbitMQ');
    } catch (error) {
        console.error('Error sending message to RabbitMQ:', error);
        res.status(500).send('Error sending message to RabbitMQ');
    }
});

app.listen(port, async () => {
    console.log(`Server is listening at http://localhost:${port}`);
    const db = await connectMongoDB();
    await startConsumers(db);
});
