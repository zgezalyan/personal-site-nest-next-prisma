import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            passwordHash: 'TEMPORARY_PASSWORD_HASH', // TODO: Replace with actual password hash
            displayName: 'Admin',
            role: 'ADMIN',
        },
    });

    await prisma.post.upsert({
        where: { slug: 'hello-world' },
        update: {},
        create: {
            title: 'Hello World',
            slug: 'hello-world',
            content: 'This is the first post on my blog.',
            authorId: admin.id,
            status: 'PUBLISHED',
        },
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});