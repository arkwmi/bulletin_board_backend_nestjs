import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class UpdateNicknameDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}
