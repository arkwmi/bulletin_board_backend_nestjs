import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, ILike } from 'typeorm';
import { Article } from './article.entity';
import { Comment } from '../comment/comment.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDetail } from './dto/article-detail.dto';
import { Parser } from 'json2csv';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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

  // ページ毎に記事取得
  async getArticlesPerPage(query: PaginateQuery): Promise<Paginated<Article>> {
    try {
      const result = paginate(query, this.articleRepository, {
        sortableColumns: ['id', 'title'],
        defaultSortBy: [['id', 'DESC']],
        defaultLimit: 10,
      });
      return result;
    } catch (error) {
      console.error('ページ毎の記事の取得に失敗しました:', error);
      throw new InternalServerErrorException(
        'ページ毎の記事の取得に失敗しました',
      );
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

  // ログイン中のユーザーが投稿した記事一覧を取得
  async getArticlesByUserId(userId: number): Promise<Article[]> {
    return await this.articleRepository.find({
      where: { userId: userId },
    });
  }

  // 記事検索
  async searchArticles(query: string): Promise<Article[]> {
    try {
      return this.articleRepository.find({
        where: [
          { title: ILike(`%${query}%`) },
          { content: ILike(`%${query}%`) },
        ],
      });
    } catch (error) {
      console.error('記事検索に失敗しました:', error);
      throw new InternalServerErrorException('記事検索に失敗しました');
    }
  }

  // 記事IDと紐づく記事、コメント一覧を取得
  async getArticleDetail(articleId: number): Promise<ArticleDetail> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
        relations: ['comments', 'comments.user'],
      });

      if (!article) {
        throw new Error('Article not found');
      }

      const articleDetail = {
        id: article.id,
        title: article.title,
        content: article.content,
        createdAt: article.createdAt,
        comments: article.comments.map((comment) => ({
          id: comment.id,
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
      console.error(
        '記事登録に失敗しました:',
        error instanceof Error ? error.message : error,
      );
      throw new InternalServerErrorException('記事登録に失敗しました');
    }
  }

  // 記事更新
  async updateArticle(updateArticleDto: UpdateArticleDto): Promise<Article> {
    try {
      const { id, title, content } = updateArticleDto;
      const article = await this.articleRepository.findOne({ where: { id } });
      if (!article) {
        throw new Error('Article not found');
      }
      article.title = title;
      article.content = content;
      return await this.articleRepository.save(article);
    } catch (error) {
      console.error('記事更新に失敗しました:', error);
      throw new InternalServerErrorException('記事更新に失敗しました');
    }
  }

  // 記事削除
  async deleteArticle(id: number): Promise<void> {
    try {
      // 先に関連するコメント削除
      await this.commentRepository.delete({ articleId: id });

      // 次に記事削除
      await this.articleRepository.delete(id);
    } catch (error) {
      console.error('記事削除に失敗しました:', error);
      throw new InternalServerErrorException('記事削除に失敗しました');
    }
  }

  // 記事データを全て取得
  async exportAllArticlesToCSV(): Promise<string> {
    const articles = await this.articleRepository.find();
    const fields = [
      'id',
      'userId',
      'title',
      'content',
      'createdAt',
      'updatedAt',
    ];
    const parser = new Parser({ fields });
    return parser.parse(articles);
  }

  // 期間指定で記事データを取得
  async exportArticlesToCSVByDate(
    startDate: string,
    endDate: string,
  ): Promise<string> {
    const articles = await this.articleRepository.find({
      where: {
        createdAt: Between(new Date(startDate), new Date(endDate)),
      },
    });
    const fields = [
      'id',
      'userId',
      'title',
      'content',
      'createdAt',
      'updatedAt',
    ];
    const parser = new Parser({ fields });
    return parser.parse(articles);
  }

  // CSVファイルから記事データをインポート
  async importArticles(batch: any[]): Promise<void> {
    try {
      const articles = batch
        .map((record) => ({
          id: parseInt(record[0], 10),
          userId: parseInt(record[1], 10),
          title: record[2].trim(),
          content: record[3].trim(),
          createdAt: new Date(record[4]),
          updatedAt: new Date(record[5]),
        }))
        .filter((article) => !isNaN(article.id)); // IDがNaNでない記事のみをフィルタリング
      console.log(articles);

      await this.articleRepository.save(articles);
    } catch (error) {
      console.error('バッチインポートエラー:', error);
      throw new InternalServerErrorException('バッチインポートに失敗しました');
    }
  }
}
