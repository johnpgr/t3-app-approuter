import { type Session, getServerSession } from "next-auth"
import { appRouter } from "~/server/api/root"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"

export async function createTRPCCaller(session?: Session | null) {
    return appRouter.createCaller({
        prisma,
        session:
            typeof session === "undefined"
                ? await getServerSession(authOptions)
                : session,
    })
}
