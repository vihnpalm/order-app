import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { OrderModule } from './order/order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    
  })

  await app.startAllMicroservices();
  await app.listen(5000);
}
bootstrap();
