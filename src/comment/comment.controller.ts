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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dto/update-comment';
import { AuthGuard, Public } from 'src/auth/auth.gurad';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post() // コメント登録
  async post(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const userId = req['user'].sub; // リクエストからユーザーID取得
    createCommentDto.userId = userId;
    await this.commentService.postComment(createCommentDto);
    return {
      message: 'コメント投稿完了',
    };
  }

  @UseGuards(AuthGuard)
  @Post('user-comments') // ログインユーザーの投稿コメントリストと記事情報を取得
  async getCommentsAndArticlesByUserId(@Req() req: Request) {
    // const { userId } = getCommentsDto;
    const userId = req['user'].sub; // リクエストからユーザーID取得
    console.log('userId', userId);
    const comments =
      await this.commentService.getCommentsAndArticlesByUserId(userId);
    return comments;
  }

  @Public()
  @Get(':id') // コメントを取得
  async getCommentById(@Param('id') id: number): Promise<Comment[]> {
    return this.commentService.getCommentById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id') // コメント更新
  async updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id') // コメント削除
  async deleteArticle(@Param('id') id: number) {
    await this.commentService.deleteComment(id);
    return {
      message: '記事削除完了',
    };
  }
}
