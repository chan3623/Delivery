import {
  PAYMENT_SERVICE,
  PaymentMicroservice,
  PRODUCT_SERVICE,
  ProductMicroservice,
  USER_SERVICE,
  UserMicroservice,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { join } from 'path';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        HTTP_PORT: Joi.number().required(),
        USER_HOST: Joi.string().required(),
        USER_TCP_PORT: Joi.number().required(),
        DB_URL: Joi.string().required(),
        PRODUCT_HOST: Joi.string().required(),
        PRODUCT_TCP_PORT: Joi.number().required(),
        PAYMENT_HOST: Joi.string().required(),
        PAYMENT_TCP_PORT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: UserMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/user.proto'),
              url: configService.getOrThrow<string>('USER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: PRODUCT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: ProductMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/product.proto'),
              url: configService.getOrThrow<string>('PRODUCT_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: PAYMENT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: PaymentMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/payment.proto'),
              url: configService.getOrThrow<string>('PAYMENT_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
