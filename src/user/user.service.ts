import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from './user.entity';
import { Parser } from 'json2csv';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserId(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // ユーザーテーブルの全ての行数を取得
  async getUserCount(): Promise<number> {
    try {
      return await this.userRepository.count();
    } catch (error) {
      console.error('会員数の取得に失敗しました:', error);
      throw new InternalServerErrorException('会員数の取得に失敗しました');
    }
  }

  // ユーザーデータを全て取得
  async exportAllUsersToCSV(): Promise<string> {
    const users = await this.userRepository.find();
    const fields = [
      'id',
      'email',
      'nickname',
      'password',
      'registerCompletedFlg',
      'createdAt',
      'updatedAt',
    ];
    const parser = new Parser({ fields });
    return parser.parse(users);
  }

  // 期間指定でユーザーデータを取得
  async exportUsersToCSVByDate(
    startDate: string,
    endDate: string,
  ): Promise<string> {
    const users = await this.userRepository.find({
      where: {
        createdAt: Between(new Date(startDate), new Date(endDate)),
      },
    });
    const fields = [
      'id',
      'email',
      'nickname',
      'password',
      'registerCompletedFlg',
      'createdAt',
      'updatedAt',
    ];
    const parser = new Parser({ fields });
    return parser.parse(users);
  }

  // CSVファイルからユーザーデータをインポート
  async importUsers(batch: any[]): Promise<void> {
    try {
      const users = batch
        .map((record) => ({
          id: parseInt(record[0], 10),
          email: record[1].trim(),
          nickname: record[2].trim(),
          password: record[3].trim(),
          registerCompletedFlg: record[4].trim() === 'true',
          createdAt: new Date(record[5]),
          updatedAt: new Date(record[6]),
        }))
        .filter((user) => !isNaN(user.id)); // IDがNaNでないユーザーのみをフィルタリング
      console.log(users);

      await this.userRepository.save(users);
    } catch (error) {
      console.error('バッチインポートエラー:', error);
      throw new InternalServerErrorException('バッチインポートに失敗しました');
    }
  }
}
