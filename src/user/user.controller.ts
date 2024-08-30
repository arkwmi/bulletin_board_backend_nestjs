import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Res,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Public } from 'src/auth/auth.gurad';
import { Response } from 'express';
import { UpdateNicknameDto } from './dto/update-nickname.dto';

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

  @Public()
  @Get('exportAll') // ユーザー全データ取得
  async exportAllUsers(@Res() res: Response): Promise<void> {
    try {
      const csvData = await this.userService.exportAllUsersToCSV();
      console.log(csvData);
      res.header('Content-Type', 'text/csv');
      res.attachment('all_users.csv');
      res.send(csvData);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      res.status(500).json({ message: 'エクスポート中にエラーが発生しました' });
    }
  }

  @Public()
  @Get('exportByDateRange') // 期間指定のユーザーデータ取得
  async exportUsersByDateRange(
    @Res() res: Response,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<void> {
    try {
      const csvData = await this.userService.exportUsersToCSVByDate(
        startDate,
        endDate,
      );
      console.log(csvData);
      res.header('Content-Type', 'text/csv');
      res.attachment('users_by_date_range.csv');
      res.send(csvData);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      res.status(500).json({ message: 'エクスポート中にエラーが発生しました' });
    }
  }

  @Public()
  @Post('import') // ユーザーデータインポート
  async importBatch(@Body() body: any) {
    const batch = body.batch;
    await this.userService.importUsers(batch);
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
