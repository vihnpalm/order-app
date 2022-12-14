import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
    
@Module({
  imports: [
    ThrottlerModule.forRoot(
      {
        ttl: 60,
        limit: 10,
      }),
    MongooseModule.forRoot('mongodb://localhost:27017', {useNewUrlParser: true}),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'STATUS',
        transport: Transport.TCP,
        options: { port: 5001}
      },
      {
        name: 'PAYMENT',
        transport: Transport.TCP,
        options: { port: 3000}
      }
    ])
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}
