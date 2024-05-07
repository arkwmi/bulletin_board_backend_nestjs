import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsBoolean()
  register_completed_flg: boolean;
}
