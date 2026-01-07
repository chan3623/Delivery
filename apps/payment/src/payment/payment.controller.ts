import { PaymentMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { PaymentMethod } from './entity/payment.entity';
import { PaymentService } from './payment.service';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  makePayment(request: PaymentMicroservice.MakePaymentRequest) {
    return this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });
  }
}
