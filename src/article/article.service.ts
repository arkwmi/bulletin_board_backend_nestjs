import { Injectable } from '@nestjs/common';
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
    return this.articleRepository.find();
  }

  // 記事IDと紐づく行取得
  async getArticleId(id: number): Promise<Article> {
    return this.articleRepository.findOne({ where: { id } });
  }

  // 記事登録
  async postArticle(createArticleDto: CreateArticleDto): Promise<void> {
    const article = new Article();
    article.userId = createArticleDto.user_id;
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;

    // DBに記事を保存
    await this.articleRepository.save(article);

    console.log('記事登録完了');
  }
}
