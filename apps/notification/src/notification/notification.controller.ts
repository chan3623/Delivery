import { RpcInterceptor } from '@app/common';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'send_payment_notification' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async sendPaymentNotification(
    @Payload() payload: SendPaymentNotificationDto,
  ) {
    return this.notificationService.sendPaymentNotification(payload);
  }
}
