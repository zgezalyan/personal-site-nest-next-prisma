import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    create(data: { email: string, passwordHash: string, displayName?: string }) {
        return this.prisma.user.create({ 
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                displayName: data.displayName,
            }, 
        });
    }

    async updateDisplayName(userId: string, displayName: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { displayName },
        });
    }

    toPublic(user: any) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}