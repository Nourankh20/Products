import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

type item = {
  id: string;
  stock: number;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/products')
  getProducts() {
    return this.appService.getProducts();
  }

  @Get('/product')
  getProduct(@Body() id:string) {
    return this.appService.getProduct(id);
  }

  @Post('/buy')
  buyProducts(@Body() products:item[]) {
    return this.appService.buy(products);

  }
}
