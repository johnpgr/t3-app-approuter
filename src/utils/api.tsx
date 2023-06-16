"use client"
/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"
import superjson from "superjson"
import { type AppRouter } from "~/server/api/root"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "" // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const api = createTRPCReact<AppRouter>()

export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
    const url = `${getBaseUrl()}/api/trpc`

    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({ url }),
            ],
            transformer: superjson,
        })
    )

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}
