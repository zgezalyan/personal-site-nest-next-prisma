import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostStatus } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  listByPostId(postId: string) {
    return this.prisma.comment.findMany({
      where: {
        postId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: { displayName: true } },
      },
    });
  }

  async createForPost(postId: string, authorId: string, content: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.create({
      data: { postId, authorId, content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: { displayName: true } },
      }
    });
  }

  async softDelete(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.deletedAt) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) throw new ForbiddenException('You are not allowed to delete this comment');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
  }
}
