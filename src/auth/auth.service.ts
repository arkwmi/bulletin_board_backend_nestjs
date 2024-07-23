import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Token } from 'src/token/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  // ユーザー仮登録(UPSERT)
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // ユーザーを作成または更新
      await this.userRepository.upsert(createUserDto, ['email']);

      // upsertは結果を返さないため最新のユーザーデータ取得して返却
      return this.userRepository.findOneBy({ email: createUserDto.email });
    } catch (error) {
      console.error('ユーザー情報の登録に失敗しました:', error);
      throw new InternalServerErrorException(
        'ユーザー情報の登録に失敗しました',
      );
    }
  }

  // トークン生成(UPSERT)
  async createToken(userId: number): Promise<Token> {
    try {
      // トークン生成
      const temporaryToken = uuidv4();
      const expirationDate = new Date();
      // トークン有効期限を1時間後に設定
      expirationDate.setUTCHours(expirationDate.getUTCHours() + 1);
      // テスト用
      // expirationDate.setMinutes(expirationDate.getMinutes() + 1);

      const tokenData = {
        userId: userId,
        temporaryToken: temporaryToken,
        expirationDate: expirationDate,
      };

      // トークン情報を保存、ユーザーIDが存在する場合は更新
      await this.tokenRepository.upsert(tokenData, ['userId']);

      // upsertは結果を返さないため最新データ取得して返却
      return this.tokenRepository.findOneBy({ userId: userId });
    } catch (error) {
      console.error('トークン生成または更新に失敗しました:', error);
      throw new InternalServerErrorException(
        'トークン生成または更新に失敗しました',
      );
    }
  }

  // 仮登録完了メール送信
  async sendTemporaryRegistrationMail(
    to: string,
    token: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject: '仮登録完了のお知らせ',
        text: `以下のリンクをクリックして本登録を完了してください。\n\n${this.configService.get<string>('FRONTEND_BASE_URL')}/complete-sign-up?token=${token}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('メール送信に失敗しました:', error);
      throw new InternalServerErrorException('メール送信に失敗しました');
    }
  }

  // トークンの有効性をチェック
  async validateToken(token: string): Promise<{ valid: boolean }> {
    try {
      const tokenEntity = await this.tokenRepository.findOneBy({
        temporaryToken: token,
      });
      if (!tokenEntity) {
        throw new NotFoundException('トークンが見つかりません。');
      }
      if (tokenEntity.expirationDate < new Date()) {
        throw new BadRequestException('トークンの有効期限が切れています。');
      }
      return { valid: true };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('トークンの検証に失敗しました:', error);
      throw new InternalServerErrorException('トークンの検証に失敗しました');
    }
  }
}
