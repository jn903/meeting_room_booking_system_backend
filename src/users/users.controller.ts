import { 
  Inject, Controller, Get, Post, Body, 
  Patch, Param, Delete, Query, UnauthorizedException ,
  SetMetadata
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { RedisService } from '../redis/redis.service.js';
import { EmailService } from '../email/email.service.js';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RequireLogin, RequirePermission,UserInfo } from '../custom.decorator.js';
import type { UserInfo as UserInfoVo} from "./vo/login-user.vo.js";

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.usersService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`
    });
    return '发送成功';
  }

  @Get("init-data")
  async initData() {
    await this.usersService.initData();
    return 'done';
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.usersService.login(loginUser, false);
    // 处理token
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });
    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.usersService.login(loginUser, true);
    // 处理token
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    vo.refreshToken = this.jwtService.sign({
      userId: vo.userInfo.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });
    return vo;
  }

  // 用户刷新token
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return await this.usersService.handleRefreshToken(refreshToken, false);
  }

  // 管理员刷新token
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    return await this.usersService.handleRefreshToken(refreshToken, true);
  }

  @Get('aaa')
  // @SetMetadata('require-login', true)
  // @SetMetadata('require-permission', ['ddd'])
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(@UserInfo('username') username: string, @UserInfo() userInfo:UserInfoVo) {
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }

}
