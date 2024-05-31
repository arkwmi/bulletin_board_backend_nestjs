import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
<<<<<<< Updated upstream
=======
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
>>>>>>> Stashed changes

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
      entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
      synchronize: true, // 開発中のみ使用（自動マイグレーションを有効にする）
    }),
    UserModule,
<<<<<<< Updated upstream
=======
    ArticleModule,
    CommentModule,
>>>>>>> Stashed changes
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
