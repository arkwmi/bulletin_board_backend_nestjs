import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('count') // 記事テーブルの全ての行数を取得
  async getArticleCount(): Promise<number> {
    return await this.articleService.getArticleCount();
  }

  @Get() // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    return await this.articleService.getAllArticles();
  }

  @Get(':id') // 記事IDと紐づく記事、コメント一覧を取得
  async getArticleDetail(@Param('id') id: number): Promise<any> {
    return this.articleService.getArticleDetail(id);
  }

  @Post() // 記事登録
  async postArticle(@Body() createArticleDto: CreateArticleDto) {
    await this.articleService.postArticle(createArticleDto);
    return {
      message: '記事投稿完了',
    };
  }
}
