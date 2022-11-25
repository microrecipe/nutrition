import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrpcController } from './app-grpc.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Nutrition } from './nutrition.entity';
import { NutritionIngridient } from './nutritions-ingridients.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController, GrpcController],
  providers: [AppService],
})
export class AppModule {}
