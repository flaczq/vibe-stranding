import "dotenv/config";
import prisma from "./src/lib/prisma";

async function makeAdmin(email: string) {
    try {
        const user = await (prisma as any).user.update({
            where: { email },
            data: { role: "ADMIN" }
        });
        console.log(`Success: ${user.name} (${user.email}) is now an ADMIN.`);
    } catch (e) {
        console.error("Error: User not found or update failed.");
    } finally {
        process.exit();
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Usage: npx tsx make-admin.ts <email>");
    process.exit();
}

makeAdmin(email);
