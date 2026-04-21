import { Body, Controller, Get, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AUTH_COOKIE_NAME, buildAuthClearCookieOptions } from './cookie.config';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { user, token, cookieOptions } = await this.authService.register(dto);
        res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
        return user;
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true}) res: Response) {
        const { user, token, cookieOptions } = await this.authService.login(dto);
        res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
        return user;
    }

    @Post('logout')
    logout(@Res({ passthrough: true}) res: Response) {
        const secure = this.configService.get<string>('NODE_ENV') === 'production';
        res.clearCookie(AUTH_COOKIE_NAME, buildAuthClearCookieOptions(secure));
        return { message: 'Logged out successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user: { id: string }) {
        const full = await this.usersService.findById(user.id);
        if (!full) throw new UnauthorizedException();
        return this.usersService.toPublic(full);
    }
}    