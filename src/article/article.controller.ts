import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticlesDto } from './dto/get-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDetail } from './dto/article-detail.dto';
import { Response } from 'express';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('count') // 記事テーブルの全ての行数を取得
  async getArticleCount(): Promise<number> {
    return await this.articleService.getArticleCount();
  }

  @Get() // ページ毎に記事取得
  async getArticlesPerPage(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Article>> {
    return await this.articleService.getArticlesPerPage(query);
  }

  @Get() // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    return await this.articleService.getAllArticles();
  }

  @Get('exportAll') // 記事全データ取得
  async exportAllArticles(@Res() res: Response): Promise<void> {
    try {
      const csvData = await this.articleService.exportAllArticlesToCSV();
      console.log(csvData);
      res.header('Content-Type', 'text/csv');
      res.attachment('all_articles.csv');
      res.send(csvData);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      res.status(500).json({ message: 'エクスポート中にエラーが発生しました' });
    }
  }

  @Get('exportByDateRange') // 期間指定の記事データ取得
  async exportArticlesByDateRange(
    @Res() res: Response,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<void> {
    try {
      const csvData = await this.articleService.exportArticlesToCSVByDate(
        startDate,
        endDate,
      );
      console.log(csvData);
      res.header('Content-Type', 'text/csv');
      res.attachment('articles_by_date_range.csv');
      res.send(csvData);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      res.status(500).json({ message: 'エクスポート中にエラーが発生しました' });
    }
  }

  @Post('import') // 記事データインポート
  async importBatch(@Body() body: any) {
    const batch = body.batch;
    await this.articleService.importArticles(batch);
  }

  @Get('search') // 記事検索
  async searchArticles(@Query('query') query: string): Promise<Article[]> {
    return this.articleService.searchArticles(query);
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
