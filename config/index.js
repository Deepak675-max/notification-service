const dotEnv = require("dotenv");

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotEnv.config({ path: envFile });

module.exports = {
    APP_PORT: process.env.APP_PORT,
    JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    JWT_ACCESS_TOKEN_HEADER: process.env.JWT_ACCESS_TOKEN_HEADER,
    DEFAULT_OFFSET: process.env.DEFAULT_OFFSET,
    DEFAULT_LIMIT: process.env.DEFAULT_LIMIT,
    DEFAULT_SORT_BY: process.env.DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER: process.env.DEFAULT_SORT_ORDER,
    APP_BACKEND_BASE_URL: process.env.APP_BACKEND_BASE_URL,
    NOTIFICATION_QUEUE: "notification_queue",
    USER_SERVICE_BASE_URL: process.env.USER_SERVICE_BASE_URL
};
