import { UserPayloadDto } from '@app/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserPayload } from '../auth/decorator/user-payload.decorator';
import { TokenGuard } from '../auth/guard/token.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(TokenGuard)
  createOrder(
    @UserPayload() userPayload: UserPayloadDto,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto, userPayload);
  }
}
