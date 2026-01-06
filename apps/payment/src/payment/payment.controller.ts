import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MakePaymentDto } from './dto/make-payment.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'make_payment' })
  @UseInterceptors(RpcInterceptor)
  @UsePipes(ValidationPipe)
  makePayment(@Payload() payload: MakePaymentDto) {
    return this.paymentService.makePayment(payload);
  }
}
