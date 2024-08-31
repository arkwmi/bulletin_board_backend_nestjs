import { Injectable, LoggerService } from '@nestjs/common';
import { Client } from 'minio';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class FileUploadService {
  private readonly logger: LoggerService;
  private storageClient: Client;

  constructor(customLoggerService: CustomLoggerService) {
    this.logger = customLoggerService;

    this.storageClient = new Client({
      endPoint: process.env.STORAGE_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: process.env.STORAGE_ACCESS_KEY,
      secretKey: process.env.STORAGE_SECRET_KEY,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const bucketName = 'images';
    const objectName = `${Date.now()}_${file.originalname}`;

    await this.storageClient.putObject(bucketName, objectName, file.buffer);
    return { message: 'minIOへのアップロードに成功しました', objectName };
  }
}
