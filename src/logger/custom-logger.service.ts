import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class CustomLoggerService implements LoggerService {
  private readonly logDir = 'logs';

  constructor() {
    // ディレクトリが存在しない場合
    if (!fs.existsSync(this.logDir)) {
      // logsディレクトリ作成
      fs.mkdirSync(this.logDir);
    }
  }

  log(message: string) {
    this.writeLog('log', message);
  }

  error(message: string, trace?: string) {
    this.writeLog('error', message, trace);
  }

  warn(message: string) {
    this.writeLog('warn', message);
  }

  private writeLog(level: string, message: string, trace?: string) {
    const date = new Date();
    // 日本時間に変換
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const formattedDate = jstDate.toISOString().split('T')[0];
    const logFileName = `error-${formattedDate}.log`;
    const logFilePath = path.join(this.logDir, logFileName);
    const logMessage = `[${jstDate.toISOString()}] [${level}] ${message}\n${trace ? trace + '\n' : ''}`;
    fs.appendFileSync(logFilePath, logMessage);
    console.log(logMessage);
  }
}
