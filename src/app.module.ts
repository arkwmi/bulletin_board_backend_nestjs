import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'username',
      password: 'password',
      database: 'bulletin_board',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      charset: 'utf8mb4',
      synchronize: true, // 開発中のみ使用（自動マイグレーションを有効にする）
    }),
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
