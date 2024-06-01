import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    try {
      return await this.articleRepository.find();
    } catch (error) {
      console.error('記事一覧の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事一覧の取得に失敗しました');
    }
  }

  // 記事登録
  async postArticle(createArticleDto: CreateArticleDto): Promise<void> {
    const article = new Article();
    article.userId = createArticleDto.userId;
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;

    try {
      // DBに記事を保存
      await this.articleRepository.save(article);
      console.log('記事登録完了');
    } catch (error) {
      console.error('記事登録に失敗しました:', error);
      throw new InternalServerErrorException('記事登録に失敗しました');
    }
  }

  // 記事テーブルの全ての行数を取得
  async getArticleCount(): Promise<number> {
    try {
      return await this.articleRepository.count();
    } catch (error) {
      console.error('記事数の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事数の取得に失敗しました');
    }
  }
}
