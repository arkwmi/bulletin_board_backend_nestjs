import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDetail } from './dto/article-detail.dto';
import { AuthGuard, Public } from 'src/auth/auth.gurad';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Public()
  @Get('count') // 記事テーブルの全ての行数を取得
  async getArticleCount(): Promise<number> {
    return await this.articleService.getArticleCount();
  }

  @Public()
  @Get() // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    return await this.articleService.getAllArticles();
  }

  @UseGuards(AuthGuard)
  @Get('user-articles') // ログイン中のユーザーが投稿した記事一覧を取得
  async getArticlesByUserId(@Req() req: Request) {
    const userId = req['user'].sub; // リクエストからユーザーID取得
    return await this.articleService.getArticlesByUserId(userId);
  }

  @Public()
  @Get(':id') // 記事IDと紐づく記事、コメント一覧を取得
  async getArticleDetail(@Param('id') id: number): Promise<ArticleDetail> {
    return this.articleService.getArticleDetail(id);
  }

  @UseGuards(AuthGuard)
  @Post() // 記事登録
  async postArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].sub; // リクエストからユーザーID取得
    createArticleDto.userId = userId;
    await this.articleService.postArticle(createArticleDto);
    return {
      message: '記事投稿完了',
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id') // 記事更新
  async updateArticle(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    updateArticleDto.id = id;
    return this.articleService.updateArticle(updateArticleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id') // 記事削除
  async deleteArticle(@Param('id') id: number) {
    await this.articleService.deleteArticle(id);
    return {
      message: '記事削除完了',
    };
  }
}
