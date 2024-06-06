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

  // 記事テーブルの全ての行数を取得
  async getArticleCount(): Promise<number> {
    try {
      return await this.articleRepository.count();
    } catch (error) {
      console.error('記事数の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事数の取得に失敗しました');
    }
  }

  // 記事一覧取得
  async getAllArticles(): Promise<Article[]> {
    try {
      return await this.articleRepository.find();
    } catch (error) {
      console.error('記事一覧の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事一覧の取得に失敗しました');
    }
  }

  // 記事IDと紐づく記事、コメント一覧を取得
  async getArticleDetail(articleId: number): Promise<any> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
        relations: ['comments', 'comments.user'],
      });

      if (!article) {
        throw new Error('Article not found');
      }

      const articleDetail = {
        title: article.title,
        content: article.content,
        createdAt: article.createdAt,
        comments: article.comments.map((comment) => ({
          comment: comment.comment,
          createdAt: comment.createdAt,
          nickname: comment.user.nickname,
        })),
      };

      // created_atの昇順に並び替え
      articleDetail.comments.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      return articleDetail;
    } catch (error) {
      console.error('記事詳細の取得に失敗しました:', error);
      throw new InternalServerErrorException('記事詳細の取得に失敗しました');
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
}
