import { UserMicroservice } from '@app/common';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
@UserMicroservice.UserServiceControllerMethods()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  getUserInfo(request: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
