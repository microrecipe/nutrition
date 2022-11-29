import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrpcController } from './grpc.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcService } from './grpc.service';
import { JwtStrategy } from './jwt.strategy';
import { Nutrition } from './nutrition.entity';
import { NutritionIngridient } from './nutritions-ingridients.entity';
import { ClientPackageNames } from './package-names.enum';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: ClientPackageNames.nutritionDeleteTopic,
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
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('NUTRITION_DB_HOST'),
        port: Number(configService.get('NUTRITION_DB_PORT')),
        username: configService.get('NUTRITION_DB_USERNAME'),
        password: configService.get('NUTRITION_DB_PASSWORD'),
        database: configService.get('NUTRITION_DB_NAME'),
        entities: [__dirname + './*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Nutrition, NutritionIngridient]),
    JwtModule.register({}),
  ],
  controllers: [AppController, GrpcController],
  providers: [AppService, JwtStrategy, GrpcService],
})
export class AppModule {}
