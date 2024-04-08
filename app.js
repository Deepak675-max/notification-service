const express = require('express');
const httpErrors = require("http-errors");
const cors = require("cors");
const path = require("path");
const notificationServiceBackendApp = express();
const http = require('http');
const cookieParser = require('cookie-parser');
require("./utils/database/init_mongodb");
const server = http.createServer(notificationServiceBackendApp);
const { APP_PORT } = require("./config/index");
const { connectToMessageBroker, consumeMessage } = require("./utils/message_broker/rabbitmq");

notificationServiceBackendApp.use(cors({
    origin: "*",
    credentials: true,
}));

notificationServiceBackendApp.use(cookieParser());
notificationServiceBackendApp.use(express.json());
notificationServiceBackendApp.use(express.urlencoded({ extended: true }));
notificationServiceBackendApp.use(express.static(path.join(__dirname, 'public')));

// connectToMessageBroker().then(() => {
//     consumeMessage();
// });


const notificationRoutes = require("./routes/notification/notification.route");
notificationServiceBackendApp.use("/api", notificationRoutes);

const messageRoutes = require("./routes/message/message.route");
notificationServiceBackendApp.use("/api", messageRoutes);

notificationServiceBackendApp.use(async (req, _res, next) => {
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
notificationServiceBackendApp.use((error, req, res, next) => {
    const responseStatus = error.status || 500;
    const responseMessage =
        error.message || `Cannot resolve request [${req.method}] ${req.url}`;
    if (res.headersSent === false) {
        res.status(responseStatus);
        res.send({
            error: {
                status: responseStatus,
                message: responseMessage,
            },
        });
    }
    next();
});

const port = APP_PORT;

server.listen(port, async () => {
    console.log("Notification Service is running on the port " + port);
    await connectToMessageBroker();
    consumeMessage();
})




