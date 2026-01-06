import { RpcInterceptor } from '@app/common';
import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Authorization } from 'apps/user/src/auth/decorator/authorization.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeliveryStarted } from './dto/delivery-started.dto';
import { OrderStatus } from './entity/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Authorization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto, token);
  }

  @EventPattern({ cmd: 'delivery_started' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStarted) {
    await this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }
}
