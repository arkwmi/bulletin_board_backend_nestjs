import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Public } from 'src/auth/auth.gurad';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Public()
  @Get('count') // ユーザーテーブルの全ての行数を取得
  async getArticleCount(): Promise<number> {
    try {
      return await this.userService.getUserCount();
    } catch (error) {
      console.error('会員数の取得に失敗しました:', error);
      throw new InternalServerErrorException('会員数の取得に失敗しました');
    }
  }
}
