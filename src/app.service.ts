import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schema/inventory.schemas';
require('dotenv').config();
//new imports
import * as AWS from 'aws-sdk';
import {config} from '../config'
const { Consumer } = require('sqs-consumer');


type item = {
  id: string;
  stock: number;
};

@Injectable()
export class AppService {
  
  params = {
    QueueUrl: config.PRODUCT_SQS_K,
  };
  private sqs;
  private sns;
  
  constructor(
    @InjectModel(Inventory.name)
    private inventroyModel: Model<InventoryDocument>,) {

      AWS.config.update({
        region: 'us-east-1',
        accessKeyId: config.ACCESS_KEY_ID_K,
        secretAccessKey: config.SECRET_ACCESS_KEY_K,
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


  async getProduct(id : string) {
    return await this.inventroyModel.findOne({_id:id}).exec();
  }




  async buy(products:item[]):Promise<any>{
    products.map(async (p)=>{
      let prod = await this.inventroyModel.findOne({_id:p.id}).exec(); 
      console.log('prod', prod.stock)
      let newQuantity;

      if(prod.stock>p.stock){
        newQuantity = prod.stock - p.stock
            }
      else{
        newQuantity = 0
      }
      await this.inventroyModel.updateOne({_id:p.id},
        {
        $set: {
          stock: newQuantity,
        },
      },
      { upsert: true }).exec();
    

      prod = await this.inventroyModel.findOne({_id:p.id}).exec(); 
      console.log('prod', prod.stock)

   })}


   consume() {
    console.log("zewwwww products")
    
    Consumer.create({
      queueUrl: config.PRODUCT_SQS_K,
      handleMessage: async (message) => {

        var params = {
          Entries: [  //required 
            {
              Id: message.MessageId, //required
              ReceiptHandle: message.ReceiptHandle //required
            },
            // more items 
          ],
          QueueUrl: config.PRODUCT_SQS_K //required 
        };

        const x = message.Body
        console.log(x)
        this.sqs.deleteMessageBatch(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
      },
    }).start()

  }
 

}
