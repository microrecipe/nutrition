import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('nutrition');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'nutritions',
        protoPath: join(__dirname, '../src/nutritions.proto'),
        url: 'localhost:3009',
      },
    },
  );

  await app.listen();

  // const app = await NestFactory.create(AppModule);

  // await app.listen(3009);

  // logger.verbose(
  //   `nutrition microservice running on port: ${await app.getUrl()}`,
  // );

  logger.verbose(`nutrition microservice is listening...`);
}
bootstrap();
