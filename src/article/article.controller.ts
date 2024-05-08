import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get() // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    return this.articleService.getAllArticles();
  }

  @Get(':id') // 記事IDと紐づく行取得
  async getArticleId(@Param('id') id: string): Promise<Article> {
    return this.articleService.getArticleId(parseInt(id, 10));
  }

  @Post('post') // 記事登録
  async postArticle(@Body() createArticleDto: CreateArticleDto) {
    await this.articleService.postArticle(createArticleDto);
    return {
      message: '記事投稿完了',
    };
  }
}
