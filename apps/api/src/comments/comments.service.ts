import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
