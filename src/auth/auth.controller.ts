import { Controller, Post, Body, Get, Query, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post() // ユーザー仮登録(UPSERT)、トークン生成登録または更新、メール送信
  async tempRegister(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    const token = await this.authService.createToken(user.id);
    await this.authService.sendTemporaryRegistrationMail(
      user.email,
      token.temporaryToken,
    );
    return { message: 'ユーザー仮登録及びメール送信完了' };
  }

  @Get('validate-token') // トークンの有効性をチェックし、有効であれば本登録で必要なuserIdを返却
  async validateToken(@Query('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Put() // ユーザー本登録
  async completeRegister(@Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(updateUserDto);
  }

  @Post('login') // 新しいログインエンドポイント
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
