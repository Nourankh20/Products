require('dotenv').config();
export const config = {
    TEST_QUEUE: process.env.TEST_QUEUE,
    SHIPMENT_SQS: process.env.SHIPMENT_SQS,
    PRODUCT_SQS: process.env.PRODUCT_SQS,
    NOTIFICATION_SQS: process.env.NOTIFICATION_SQS,
    AWS_REGION: process.env.AWS_REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    SNS_ARN: process.env.SNS_ARN,
};