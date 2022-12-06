import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionsController } from './nutritions/nutritions.controller';
import { Nutrition } from './entities/nutrition.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { NutritionIngredient } from './entities/nutrition-ingredient.entity';
import { ClientPackageNames } from './nutritions.enum';
import { NutritionsService } from './nutritions/nutritions.service';
import { NutritionsGrpcController } from './nutritions/nutritions-grpc.controller';
import { NutritionsGrpcService } from './nutritions/nutritions-grpc.service';

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
        entities: [__dirname + './entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Nutrition, NutritionIngredient]),
    JwtModule.register({}),
  ],
  controllers: [NutritionsController, NutritionsGrpcController],
  providers: [NutritionsService, JwtStrategy, NutritionsGrpcService],
})
export class AppModule {}
