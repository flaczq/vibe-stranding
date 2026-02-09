import { PrismaClient } from "@prisma/client";
// If you see an error here, try restarting your TypeScript server (Cmd+Shift+P > Restart TS Server)
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
