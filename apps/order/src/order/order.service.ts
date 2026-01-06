import { PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { AddressDto } from './dto/address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentDto } from './dto/payment.dto';
import { Customer } from './entity/customer.entity';
import { Order } from './entity/order.entity';
import { Product } from './entity/product.entity';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,

    @Inject(PRODUCT_SERVICE)
    private readonly productService: ClientProxy,

    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const { productIds, address, payment } = createOrderDto;

    /// 1) 사용자 정보 가져오기
    const user = await this.getUserFromToken(token);

    /// 2) 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds);

    /// 3) 총 금액 계산하기
    const totalAmount = this.calculateTotalAmount(products);

    /// 4) 금액 검증하기 - total이 맞는지 (front에서 보내준 데이터랑 비교)
    this.validatePaymentAmount(totalAmount, payment.amount);

    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    const customer = this.createCustomer(user);
    const order = await this.createNewOrder(
      customer,
      products,
      address,
      payment,
    );
    /// 6) 결제 시도하기
    /// 7) 주문 상태 업데이트 하기
    /// 8) 결과 반환하기
  }

  private async getUserFromToken(token: string) {
    /// 1) User MS : JWT 토큰 검증
    const tResp = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    if (tResp.status === 'error') {
      throw new PaymentCancelledException(tResp);
    }

    /// 2) User MS : 사용자 정보 가져오기
    const userId = tResp.data.sub;
    const uResp = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );

    if (uResp.status === 'error') {
      throw new PaymentCancelledException(uResp);
    }

    return uResp.data;
  }

  private async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const resp = await lastValueFrom(
      this.productService.send({ cmd: 'get_products_info' }, { productIds }),
    );

    if (resp.status === 'error') {
      throw new PaymentCancelledException('상품 정보가 잘못되었습니다.');
    }

    /// Product Entity로 전환
    return resp.data.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }

  private calculateTotalAmount(products: Product[]) {
    return products.reduce((acc, next) => acc + next.price, 0);
  }

  private validatePaymentAmount(totalA: number, totalB: number) {
    if (totalA !== totalB) {
      throw new PaymentCancelledException('결제하려는 금액이 변경 되었습니다.');
    }
  }

  private createCustomer(user: { id: string; email: string; name: string }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }
}
