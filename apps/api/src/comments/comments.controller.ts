import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('post/:postId')
  listByPost(@Param('postId') postId: string) {
    return this.commentsService.listByPostId(postId);
  }
}
