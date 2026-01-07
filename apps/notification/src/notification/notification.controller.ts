import { NotificationMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
@NotificationMicroservice.NotificationServiceControllerMethods()
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  async sendPaymentNotification(
    request: NotificationMicroservice.SendPaymentNotificationRequest,
  ) {
    const resp = (
      await this.notificationService.sendPaymentNotification(request)
    ).toJSON();
    return {
      ...resp,
      status: resp.status.toString(),
    };
  }
}
