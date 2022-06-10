require('dotenv').config();
export const config = {
    TEST_QUEUE_K: process.env.TEST_QUEUE_K,
    SHIPMENT_SQS_K: process.env.SHIPMENT_SQS_K,
    PRODUCT_SQS_K: process.env.PRODUCT_SQS_K,
    NOTIFICATION_SQS_K: process.env.NOTIFICATION_SQS_K,
    AWS_REGION_K: process.env.AWS_REGION_K,
    ACCESS_KEY_ID_K: process.env.ACCESS_KEY_ID_K,
    SECRET_ACCESS_KEY_K: process.env.SECRET_ACCESS_KEY_K,
    SNS_ARN_K: process.env.SNS_ARN_K,
};