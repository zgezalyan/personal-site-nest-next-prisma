import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user: any) {
        const full = await this.usersService.findById(user.id);
        return this.usersService.toPublic(full);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
        const updated = await this.usersService.updateDisplayName(user.id, dto.displayName);
        return this.usersService.toPublic(updated);
    }
}