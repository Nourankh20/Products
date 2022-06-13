import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schema/inventory.schemas';
require('dotenv').config();
//new imports
import * as AWS from 'aws-sdk';
// import {config} from '../config'
const { Consumer } = require('sqs-consumer');

type item = {
  id: string;
  stock: number;
};

@Injectable()
export class AppService {
  params = {
    QueueUrl: process.env.PRODUCT_SQS_K,
  };
  private sqs;
  private sns;

  constructor(
    @InjectModel(Inventory.name)
    private inventroyModel: Model<InventoryDocument>,
  ) {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.ACCESS_KEY_ID_K,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_K,
    });
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31' });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getProducts() {
    return await this.inventroyModel.find().exec();
  }

  async getProduct(id: string) {
    return await this.inventroyModel.findOne({ _id: id }).exec();
  }


  async buy(body: any): Promise<any> {
    // let z = body
    const z = await body;
    const msg = {
      id: z.productId,
      stock: z.quantity,
    };
    let prod = await this.inventroyModel.findOne({ _id: msg.id }).exec();
    console.log('prod', prod.stock);
    let newQuantity;

    if (prod.stock > msg.stock) {
      newQuantity = prod.stock - msg.stock;
    } else {
      newQuantity = 0;
    }
    const update = await this.inventroyModel
      .updateOne(
        { _id: msg.id },
        {
          $set: {
            stock: newQuantity,
          },
        },
        { upsert: true },
      )
      .exec();
    return await this.inventroyModel.findOne({ _id: msg.id }).exec();

   

    console.log('prod', prod.stock);
  }

  async consume() {
    console.log("consumer start")
    Consumer.create({
      queueUrl: process.env.NOTIFICATION_SQS_K,
      handleMessage: async (message) => {
     console.log("handleMessage start")

        var params = {
          Entries: [ /* required */
            {
              Id: message.MessageId, /* required */
              ReceiptHandle: message.ReceiptHandle/* required */
            },
            /* more items */
          ],
          QueueUrl: process.env.PRODUCT_SQS_K /* required */
        };
        console.log("consumer");
        var x = await JSON.parse(message.Body);
        var y = await JSON.parse(x.Message);
        
        console.log(y);
        this.buy(y);
        this.sqs.deleteMessageBatch(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else console.log("deleted ",data);           // successful response
        });
        
      },
    }).start()

  }
}
