import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { TokenModule } from './token/token.module';
import { AuthModule } from './auth/auth.module';
import { CustomLoggerService } from './logger/custom-logger.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.gurad';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        charset: 'utf8mb4',
        synchronize: true, // 開発中のみ使用（自動マイグレーションを有効にする）
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TokenModule,
    AuthModule,
    ArticleModule,
    CommentModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLoggerService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [CustomLoggerService],
})
export class AppModule {}
