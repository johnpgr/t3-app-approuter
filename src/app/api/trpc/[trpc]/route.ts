import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { getServerSession } from "next-auth"
import { type NextRequest } from "next/server"
import { env } from "~/env.mjs"
import { appRouter } from "~/server/api/root"
import { createInnerTRPCContext } from "~/server/api/trpc"
import { authOptions } from "~/server/auth"

async function handler(req: NextRequest) {
    const session = await getServerSession(authOptions)

    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: req,
        router: appRouter,
        createContext() {
            return createInnerTRPCContext({ session })
        },
        onError:
            env.NODE_ENV === "development"
                ? ({ path, error }) => {
                      console.error(
                          `tRPC failed on ${path ?? "<no-path>"}: ${
                              error.message
                          }`
                      )
                  }
                : undefined,
    })
}

export { handler as GET, handler as POST }
