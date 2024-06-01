import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get() // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    try {
      return await this.articleService.getAllArticles();
    } catch (error) {
      console.error('記事一覧の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事一覧の取得に失敗しました');
    }
  }

  @Get(':id') // 記事IDと紐づく行取得
  async getArticleId(@Param('id') id: string): Promise<Article> {
    try {
      return this.articleService.getArticleId(parseInt(id, 10));
    } catch (error) {
      console.error('記事詳細の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事詳細の取得に失敗しました');
    }
  }

  @Post() // 記事登録
  async postArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      await this.articleService.postArticle(createArticleDto);
      return {
        message: '記事投稿完了',
      };
    } catch (error) {
      console.error('記事投稿に失敗しました:', error);
      throw new InternalServerErrorException('記事投稿に失敗しました');
    }
  }
}
