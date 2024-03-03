/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      logging: true,
      synchronize: process.env.NODE_ENV == 'development' && true
    }),
    ProductModule,
    OrdersModule,
    AuthModule,
    RabbitmqModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { 
  
}
