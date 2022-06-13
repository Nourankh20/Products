import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document ,ObjectId} from "mongoose";

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {
 
  @Prop({ required: true })
  id: number;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  weight: number;
  
  @Prop({ required: true })
  measurement: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  price: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
