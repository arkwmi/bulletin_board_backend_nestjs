import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dto/update-comment';

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

  @Post('user-comments') // ログインユーザーの投稿コメントリストと記事情報を取得
  async getCommentsAndArticlesByUserId(@Body() getCommentsDto: GetCommentsDto) {
    const { userId } = getCommentsDto;
    const comments =
      await this.commentService.getCommentsAndArticlesByUserId(userId);
    return comments;
  }

  @Get(':id') // コメントを取得
  async getCommentById(@Param('id') id: number): Promise<Comment[]> {
    return this.commentService.getCommentById(id);
  }

  @Put(':id') // コメント更新
  async updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Delete(':id') // コメント削除
  async deleteArticle(@Param('id') id: number) {
    await this.commentService.deleteComment(id);
    return {
      message: '記事削除完了',
    };
  }
}
