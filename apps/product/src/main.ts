import { ProductMicroservice } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ProductMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/product.proto'),
      url: configService.getOrThrow<string>('GRPC_URL'),
    },
  });

  await app.init();

  await app.startAllMicroservices();
}
bootstrap();
