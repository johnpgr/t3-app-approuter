"use client"

import { SessionProvider } from "next-auth/react"
import { TRPCProvider } from "~/utils/api"

export const Providers = (props: { children: React.ReactNode }) => {
    return (
        <SessionProvider refetchOnWindowFocus={false}>
            <TRPCProvider>{props.children}</TRPCProvider>
        </SessionProvider>
    )
}
