import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OrderModule } from './order/order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.connectMicroservice({
    transport: Transport.TCP,
  })

  const config = new DocumentBuilder()
    .setTitle('Test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(5000);
}
bootstrap();
