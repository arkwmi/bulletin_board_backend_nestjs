import { Command, CommandRunner } from 'nest-commander';
import { UserService } from 'src/user/user.service';
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import * as fs from 'fs';

@Command({ name: 'export-users' })
export class UserCommand extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  // ディレクトリなかったら作成
  private ensureDirExist(filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private logWithTimestamp(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  async run(): Promise<void> {
    this.logWithTimestamp('処理開始');
    try {
      const users = await this.userService.getAllUsers();
      const userCount = users.length;

      if (userCount === 0) {
        this.logWithTimestamp('ユーザーデータが1件もありません');
        return;
      }
      const fileName = 'users.csv';
      const outputPath = path.join(__dirname, `../output/${fileName}`);

      // ディレクトリが存在しない場合に作成
      this.ensureDirExist(outputPath);

      // CSV出力設定
      const csvWriter = createObjectCsvWriter({
        path: path.join(__dirname, `../output/${fileName}`),
        header: [
          { id: 'id', title: 'id' },
          { id: 'email', title: 'email' },
          { id: 'nickname', title: 'nickname' },
        ],
      });
      // CSV出力
      await csvWriter.writeRecords(users);

      this.logWithTimestamp(`ユーザー件数: ${userCount}`);
      this.logWithTimestamp(`出力ファイル名: ${fileName}`);
      this.logWithTimestamp('処理終了');
    } catch (error) {
      this.logWithTimestamp('処理失敗');
      console.error('処理失敗', error);
    }
  }
}
