import { GrpcInterceptor, UserMicroservice } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
@UserMicroservice.UserServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserInfo(request: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
