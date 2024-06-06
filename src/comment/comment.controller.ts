import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post() // コメント登録
  async post(@Body() createCommentDto: CreateCommentDto) {
    await this.commentService.postComment(createCommentDto);
    return {
      message: 'コメント投稿完了',
    };
  }
}
