import { Controller, Get, Param } from "@nestjs/common";
import { PostsService } from "./posts.service";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    listPublished() {
        return this.postsService.listPublished();
    }

    @Get(':slug')
    getBySlug(@Param('slug') slug: string) {
        return this.postsService.getBySlug(slug);
    }
}