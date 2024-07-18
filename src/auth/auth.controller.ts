import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  @Get('validate-token') // トークンの有効性チェック
  async validateToken(@Query('token') token: string) {
    await this.authService.validateToken(token);
    return { valid: true };
  }
}
