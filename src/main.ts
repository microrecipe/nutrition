import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  GrpcOptions,
  MicroserviceOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'nutritions',
      protoPath: join(__dirname, '../src/nutritions.proto'),
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
