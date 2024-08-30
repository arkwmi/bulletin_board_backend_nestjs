import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  //   BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import * as path from 'path';
import { Public } from 'src/auth/auth.gurad';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  // FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (_req, file, callback) => {
  //       const ext = path.extname(file.originalname);
  //       callback(null, `${Date.now()}${ext}`);
  //     },
  //   }),
  //   fileFilter: (_req, file, callback) => {
  //     if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
  //       return callback(
  //         new BadRequestException('画像データを選択してください'),
  //         false,
  //       );
  //     }
  //     callback(null, true);
  //   },
  // }),
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileUploadService.uploadFile(file);
  }
}
