import "dotenv/config";
import { PrismaClient } from '@prisma/client/index';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { CHALLENGES, ACHIEVEMENTS } from '../src/lib/game-data';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Seed Challenges
    for (const challenge of CHALLENGES) {
        await prisma.challenge.upsert({
            where: { id: challenge.id },
            update: {
                title: challenge.title,
                description: challenge.description,
                category: challenge.category,
                difficulty: challenge.difficulty,
                xpReward: challenge.xpReward,
                instructions: challenge.instructions,
                starterCode: challenge.starterCode,
                hints: challenge.hints,
                tags: challenge.tags,
            },
            create: {
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                category: challenge.category,
                difficulty: challenge.difficulty,
                xpReward: challenge.xpReward,
                instructions: challenge.instructions,
                starterCode: challenge.starterCode,
                hints: challenge.hints,
                tags: challenge.tags,
            },
        });
    }

    // Seed Achievements
    for (const achievement of ACHIEVEMENTS) {
        await prisma.achievement.upsert({
            where: { id: achievement.id },
            update: {
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                xpBonus: achievement.xpBonus,
            },
            create: {
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                xpBonus: achievement.xpBonus,
            },
        });
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
