import {
  constructorMetadata,
  USER_SERVICE,
  UserMicroservice,
} from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

  async use(req: any, res: any, next: (error?: any) => void) {
    /// 1) Raw Token 가져오기
    const token = this.getRawToken(req);

    if (!token) {
      next();
      return;
    }

    /// 2) User Auth에 Token 넘겨주기
    const payload = await this.verifyToken(token);

    /// 3) req.user payload 붙이기
    req.user = payload;

    next();
  }

  getRawToken(req: any): string | null {
    const authHeader = req.headers['authorization'];

    return authHeader;
  }

  async verifyToken(token: string) {
    const result = await lastValueFrom(
      this.authService.parseBearerToken(
        { token },
        constructorMetadata(BearerTokenMiddleware.name, 'verifyToken'),
      ),
    );

    return result;
  }
}
