import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesDto } from './dto/get-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDetail } from './dto/article-detail.dto';

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
  async getArticleDetail(@Param('id') id: number): Promise<ArticleDetail> {
    return this.articleService.getArticleDetail(id);
  }

  @Post() // 記事登録
  async postArticle(@Body() createArticleDto: CreateArticleDto) {
    await this.articleService.postArticle(createArticleDto);
    return {
      message: '記事投稿完了',
    };
  }

  @Post('user-articles') // ログイン中のユーザーが投稿した記事一覧を取得
  async getArticlesByUserId(@Body() getArticlesDto: GetArticlesDto) {
    const { userId } = getArticlesDto;
    return await this.articleService.getArticlesByUserId(userId);
  }

  @Put(':id') // 記事更新
  async updateArticle(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    updateArticleDto.id = id;
    return this.articleService.updateArticle(updateArticleDto);
  }

  @Delete(':id') // 記事削除
  async deleteArticle(@Param('id') id: number) {
    await this.articleService.deleteArticle(id);
    return {
      message: '記事削除完了',
    };
  }
}
