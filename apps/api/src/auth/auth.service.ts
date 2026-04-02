import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) throw new BadRequestException('User with this email already exists');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
            displayName: dto.displayName,
        });

        return this.usersService.toPublic(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        const cookieOptions = {
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: false,
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        return { user: this.usersService.toPublic(user), token, cookieOptions };
    }
}