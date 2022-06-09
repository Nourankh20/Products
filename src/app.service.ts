import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schema/inventory.schemas';
require('dotenv').config();

type item = {
  id: string;
  stock: number;
};

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Inventory.name)
    private inventroyModel: Model<InventoryDocument>,
  ) {}

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
}
