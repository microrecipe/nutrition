import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  GrpcOptions,
  KafkaOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'nutritions',
      protoPath: join(__dirname, '../src/proto/nutritions.proto'),
      url: `0.0.0.0:${process.env.NUTRITION_GRPC_PORT}`,
    },
  });

  app.connectMicroservice<TcpOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.NUTRITION_TCP_PORT),
    },
  });

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'microrecipe',
        brokers: process.env.KAFKA_BROKERS.split(','),
      },
      consumer: {
        groupId: 'nutrition',
      },
    },
  });

  await app.startAllMicroservices();

  logger.log(
    `gRPC service running on port: ${process.env.NUTRITION_GRPC_PORT}`,
  );

  logger.log(`TCP service running on port: ${process.env.NUTRITION_TCP_PORT}`);

  await app.listen(process.env.NUTRITION_REST_PORT);

  logger.log(
    `HTTP service running on port: ${process.env.NUTRITION_REST_PORT}`,
  );
}
bootstrap();
