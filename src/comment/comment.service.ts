import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // コメント登録
  async postComment(createCommentDto: CreateCommentDto): Promise<void> {
    const comment = new Comment();
    comment.userId = createCommentDto.userId;
    comment.articleId = createCommentDto.articleId;
    comment.comment = createCommentDto.comment;

    // DBにコメントを保存
    await this.commentRepository.save(comment);

    console.log('コメント登録完了');
  }
}
