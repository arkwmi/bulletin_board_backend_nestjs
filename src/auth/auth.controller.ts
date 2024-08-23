import { Controller, Post, Body, Get, Query, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './auth.gurad';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
  @Get('validate-token') // トークンの有効性をチェックし、有効であれば本登録で必要なuserIdを返却
  async validateToken(@Query('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Public()
  @Put() // ユーザー本登録
  async completeRegister(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return this.authService.updateUser(updateUserDto, res);
  }

  @Public()
  @Post('login') // ログイン処理
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }
}
