import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAILER_OPTIONS') private readonly mailerService: MailerService,
  ) {}

  async sendTest(mailAdress: string, name: string) {
    await this.mailerService.sendMail({
      to: mailAdress,
      subject: 'テストメール',
      template: './test',
      context: {
        name: name,
      },
    });
  }
}
