import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Inventory, InventorySchema } from './schema/inventory.schemas';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
