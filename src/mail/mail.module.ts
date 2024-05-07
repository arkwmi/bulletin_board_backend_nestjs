import { Module } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { MailService } from './mail.service';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { join } from 'path';

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       // SMTPの設定
//       transport: {
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: true,
//         auth: {
//           user: 'codetrain.mai.arakawa@gmail.com',
//           pass: 'loatech929',
//         },
//       }, // デフォルトでの送信元メールアドレスの設定
//       defaults: {
//         from: 'codetrain.mai.arakawa@gmail.com',
//       },
//       // テンプレートの設定
//       template: {
//         dir: join(__dirname, '/templates'),
//         adapter: new HandlebarsAdapter(),
//         options: {
//           strict: true,
//         },
//       },
//     }),
//   ],
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}

@Module({
  providers: [
    {
      provide: 'MAILER_OPTIONS',
      useValue: {
        // メール送信に必要な設定
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: true,
          auth: {
            user: 'codetrain.mai.arakawa@gmail.com',
            pass: 'loatech929',
          },
        },
      },
    },
    MailerService,
  ],
  exports: [MailerService],
})
export class MailModule {}
