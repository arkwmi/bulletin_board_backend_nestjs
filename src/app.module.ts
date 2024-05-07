import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: '127.0.0.1',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'root',
      database: 'bulletin_board',
      entities: [__dirname + '/user/*.entity{.ts,.js}'],
      synchronize: true, // 開発中のみ使用（自動マイグレーションを有効にする）
    }),
    UserModule,
    MailerModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
