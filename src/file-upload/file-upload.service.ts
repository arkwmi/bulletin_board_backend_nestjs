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
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    this.logger.log('入った？');
    this.logger.log(`File buffer type: ${typeof file.buffer}`);
    this.logger.log(`File buffer length: ${file.buffer.length}`);

    const bucketName = 'images';
    const objectName = `${Date.now()}_${file.originalname}`;

    await this.minioClient.putObject(bucketName, objectName, file.buffer);
    return { message: 'minIOへのアップロードに成功しました', objectName };
  }
}
