import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';

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

  @Post('import') // ユーザーデータインポート
  async importBatch(@Body() body: any) {
    const batch = body.batch;
    await this.userService.importUsers(batch);
  }
}
