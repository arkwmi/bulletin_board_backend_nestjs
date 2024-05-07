import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async tempRegister(createUserDto: CreateUserDto): Promise<void> {
    const user = new User();
    user.email = createUserDto.email;

    // DBにemailを保存
    await this.userRepository.save(user);

    // 一時トークン生成
    const token = uuidv4();

    // 本登録URL生成
    const registrationUrl = `http://localhost:3000/complete-registration?token=${token}`;

    // 本登録用のメールを送信
    await this.mailerService.sendMail({
      to: user.email,
      subject: '仮登録完了のお知らせ',
      template: 'complete-registration',
      context: {
        message:
          '仮登録が完了しました。以下のURLをクリックして本登録にお進みください。',
        registrationUrl,
      },
    });

    console.log('仮登録完了');
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserId(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
