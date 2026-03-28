import { Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    listPublished() {
        return this.prisma.post.findMany({
            where: { status: PostStatus.PUBLISHED },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
                author: { select: { displayName: true } },
            },
        });
    }

    async getBySlug(slug: string) {
        const post = await this.prisma.post.findUnique({
            where: { slug },
            include: {
                author: { select : { displayName: true} },
                comments: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'asc' },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: { select: { displayName: true } },
                    },
                },
            },
        });

        if (!post || post.status !== PostStatus.PUBLISHED) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }
}