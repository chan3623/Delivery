import { GrpcInterceptor, NotificationMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Controller, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
@NotificationMicroservice.NotificationServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  async sendPaymentNotification(
    request: NotificationMicroservice.SendPaymentNotificationRequest,
    metadata: Metadata,
  ) {
    const resp = (
      await this.notificationService.sendPaymentNotification(request, metadata)
    ).toJSON();
    return {
      ...resp,
      status: resp.status.toString(),
    };
  }
}
