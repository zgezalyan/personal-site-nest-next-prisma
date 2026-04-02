import { Controller, Get, Param, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('post/:postId/comments')
  list(@Param('postId') postId: string) {
    return this.commentsService.listByPostId(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('post/:postId/comments')
  create(
    @Param('postId') postId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createForPost(postId, user.id, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:commentId')
  remove(
    @Param('commentId') commentId: string, 
    @CurrentUser() user: any
  ) {
    return this.commentsService.softDelete(commentId, user.id).then(() => ({ message: 'Comment deleted successfully' }));
  }
}
