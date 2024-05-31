import { Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getAllArticles(): Promise<Article[]> {
    return this.articleService.getAllArticles();
  }
<<<<<<< Updated upstream
=======

  @Get(':id') // 記事IDと紐づく記事、コメント一覧を取得
  async getArticleDetail(@Param('id') id: string): Promise<Article> {
    return this.articleService.getArticleDetail(parseInt(id, 10));
  }

  @Post('post') // 記事登録
  async postArticle(@Body() createArticleDto: CreateArticleDto) {
    await this.articleService.postArticle(createArticleDto);
    return {
      message: '記事投稿完了',
    };
  }
>>>>>>> Stashed changes
}
