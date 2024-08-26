import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.gurad';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // クッキーへのアクセス
  app.use(cookieParser());

  // デコレーターやメタデータを操作
  const reflector = app.get(Reflector);
  // トークンの生成、検証、デコード
  const jwtService = app.get(JwtService);

  // グローバルガードを設定
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  // CORS設定を有効化
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // リクエストボディサイズ制限を設定
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // CLIコマンドを実行する
  await CommandFactory.run(AppModule);

  await app.listen(5555);
}
bootstrap();
