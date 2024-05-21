import { IsNumber, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
