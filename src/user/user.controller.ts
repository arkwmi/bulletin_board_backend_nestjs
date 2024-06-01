import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

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
