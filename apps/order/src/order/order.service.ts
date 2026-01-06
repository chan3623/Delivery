import { PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,

    @Inject(PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const { productIds, address, payment } = createOrderDto;

    /// 1) 사용자 정보 가져오기
    const user = await this.getUserFromToken(token);

    /// 2) 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds);
    /// 3) 총 금액 계산하기
    /// 4) 금액 검증하기 - total이 맞는지 (front에서 보내준 데이터랑 비교)
    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    /// 6) 결제 시도하기
    /// 7) 주문 상태 업데이트 하기
    /// 8) 결과 반환하기
  }

  async getUserFromToken(token: string) {
    /// 1) User MS : JWT 토큰 검증
    const tResp = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    if (tResp.status === 'error') {
      throw new PaymentCancelledException(tResp);
    }

    const userId = tResp.data.sub;
    const uResp = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );

    if (uResp.status === 'error') {
      throw new PaymentCancelledException(uResp);
    }

    return uResp.data;
    /// 2) User MS : 사용자 정보 가져오기
  }

  async getProductsByIds(productIds: string[]) {
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
}
