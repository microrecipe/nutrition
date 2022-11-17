import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('nutrition');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'nutritions',
      protoPath: join(__dirname, '../src/nutritions.proto'),
      url: `${process.env.NUTRITION_HOST}:${process.env.NUTRITION_GRPC_PORT}`,
    },
  });

  await app.startAllMicroservices();

  logger.verbose(`nutrition microservice is listening...`);

  await app.listen(process.env.NUTRITION_REST_PORT);

  logger.verbose(
    `nutrition service running on port: ${process.env.NUTRITION_REST_PORT}`,
  );
}
bootstrap();
