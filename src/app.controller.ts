import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { RequireLogin, RequirePermission, UserInfo } from './custom.decorator.js';
import type { UserInfo as UserInfoVo } from "./users/vo/login-user.vo.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  // @SetMetadata('require-login', true)
  // @SetMetadata('require-permission', ['ddd'])
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(@UserInfo('username') username: string, @UserInfo() userInfo: UserInfoVo) {
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
