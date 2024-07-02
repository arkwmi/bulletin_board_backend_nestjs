import { IsNotEmpty } from 'class-validator';

export class UpdateArticleDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
