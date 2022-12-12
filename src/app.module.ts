import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'; // add this
import { OrderModule } from './order/order.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {useNewUrlParser: true}),
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}