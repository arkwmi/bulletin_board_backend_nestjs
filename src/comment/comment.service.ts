import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // コメント登録
  async postComment(createCommentDto: CreateCommentDto): Promise<void> {
    try {
      const comment = new Comment();
      comment.userId = createCommentDto.userId;
      comment.articleId = createCommentDto.articleId;
      comment.comment = createCommentDto.comment;

      // DBにコメントを保存
      await this.commentRepository.save(comment);

      console.log('コメント登録完了');
    } catch (error) {
      console.error('コメント登録に失敗しました:', error);
      throw new InternalServerErrorException('コメント登録に失敗しました');
    }
  }

  // ログインユーザーが投稿した全コメントとそれに紐づく記事情報を取得
  async getCommentsAndArticlesByUserId(userId: number): Promise<Comment[]> {
    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        // commentエンティティに関連するarticleエンティティを結合しコメントに紐づく記事を取得
        .leftJoinAndSelect('comment.article', 'article')
        .where('comment.userId = :userId', { userId })
        .getMany();

      return comments;
    } catch (error) {
      console.error('コメントと記事情報の取得に失敗しました:', error);
      throw new InternalServerErrorException(
        'コメントと記事情報の取得に失敗しました',
      );
    }
  }

  // コメント取得
  async getCommentById(id: number): Promise<Comment[]> {
    try {
      return this.commentRepository.find({
        where: { id },
        relations: ['article', 'user'],
      });
    } catch (error) {
      console.error('コメント取得に失敗しました:', error);
      throw new InternalServerErrorException('コメント取得に失敗しました');
    }
  }

  // コメント更新
  async updateComment(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    try {
      const { comment } = updateCommentDto;
      const commentResult = await this.commentRepository.findOne({
        where: { id },
      });
      if (!commentResult) {
        throw new Error('Comment not found');
      }
      commentResult.comment = comment;
      return await this.commentRepository.save(commentResult);
    } catch (error) {
      console.error('コメント更新に失敗しました:', error);
      throw new InternalServerErrorException('コメント更新に失敗しました');
    }
  }

  // コメント削除
  async deleteComment(id: number): Promise<void> {
    try {
      await this.commentRepository.delete({ id });
    } catch (error) {
      console.error('コメント削除に失敗しました:', error);
      throw new InternalServerErrorException('コメント削除に失敗しました');
    }
  }
}
