import { ProductMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
@ProductMicroservice.ProductServiceControllerMethods()
export class ProductController
  implements ProductMicroservice.ProductServiceController
{
  constructor(private readonly productService: ProductService) {}

  async createSample() {
    const resp = await this.productService.createSample();
    return {
      success: resp,
    };
  }

  async getProductsInfo(request: ProductMicroservice.GetProductsInfoRequest) {
    const resp = await this.productService.getProductsInfo(request.productIds);
    return {
      products: resp,
    };
  }
}
