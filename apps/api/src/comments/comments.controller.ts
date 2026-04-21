import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { AuthUser } from '../auth/auth-user.type';

@Controller('posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId/comments')
  list(
    @Param('postId') postId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.commentsService.listByPostId(postId, limit, offset);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  create(
    @Param('postId') postId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createForPost(postId, user.id, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId')
  async remove(
    @Param('postId') _postId: string,
    @Param('commentId') commentId: string, 
    @CurrentUser() user: AuthUser
  ) {
    await this.commentsService.softDelete(commentId, user.id);
    return ({ message: 'Comment deleted successfully' });
  }
}
