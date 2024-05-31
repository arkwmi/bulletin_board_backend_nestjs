import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async getAllArticles(): Promise<Article[]> {
    return this.articleRepository.find();
  }
<<<<<<< Updated upstream
=======

  // 記事IDと紐づく記事、コメント一覧を取得
  async getArticleDetail(articleId: number): Promise<any> {
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
  }

  // 記事登録
  async postArticle(createArticleDto: CreateArticleDto): Promise<void> {
    const article = new Article();
    article.userId = createArticleDto.userId;
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;

    // DBに記事を保存
    await this.articleRepository.save(article);

    console.log('記事登録完了');
  }
>>>>>>> Stashed changes
}
