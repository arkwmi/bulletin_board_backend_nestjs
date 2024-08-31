import { Injectable, LoggerService } from '@nestjs/common';
import { Client } from 'minio';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class FileUploadService {
  private readonly logger: LoggerService;
  private minioClient: Client;

  constructor(customLoggerService: CustomLoggerService) {
    this.logger = customLoggerService;

    this.minioClient = new Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'minio',
      secretKey: 'password',
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const bucketName = 'images';
    const objectName = `${Date.now()}_${file.originalname}`;

    await this.minioClient.putObject(bucketName, objectName, file.buffer);
    return { message: 'minIOへのアップロードに成功しました', objectName };
  }
}
