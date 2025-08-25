import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, CustomLoggerService],
})
export class FileUploadModule {}
