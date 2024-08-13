import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
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

  @Put('nickname') // ニックネーム更新
  async updateNickname(
    @Body() updateNicknameDto: UpdateNicknameDto,
  ): Promise<void> {
    try {
      await this.userService.updateNickname(
        updateNicknameDto.userId,
        updateNicknameDto.nickname,
      );
    } catch (error) {
      console.error('ニックネームの更新に失敗しました:', error);
      throw new InternalServerErrorException(
        'ニックネームの更新に失敗しました',
      );
    }
  }

  @Put('password') // パスワード更新
  async updatePassword(
    @Body() updateNicknameDto: UpdateNicknameDto,
  ): Promise<void> {
    try {
      await this.userService.updateNickname(
        updateNicknameDto.userId,
        updateNicknameDto.nickname,
      );
    } catch (error) {
      console.error('パスワードの更新に失敗しました:', error);
      throw new InternalServerErrorException('パスワードの更新に失敗しました');
    }
  }
}
