"use client"

import type { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { api } from "~/utils/api"
import type { RouterOutputs } from "~/utils/types"

export const HomePage = (props: {
    hello?: RouterOutputs["example"]["hello"]
    secretMessage?: RouterOutputs["example"]["getSecretMessage"]
    serverSession?: Session | null
}) => {
    const hello = api.example.hello.useQuery(
        { text: "from tRPC" },
        {
            initialData: props.hello,
            staleTime: Infinity,
        }
    )

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    Create <span className="text-[hsl(280,100%,70%)]">T3</span>{" "}
                    App
                </h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    <Link
                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                        href="https://create.t3.gg/en/usage/first-steps"
                        target="_blank"
                    >
                        <h3 className="text-2xl font-bold">First Steps</h3>
                        <div className="text-lg">
                            Just the basics - Everything you need to know to set
                            up your database and authentication.
                        </div>
                    </Link>
                    <Link
                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                        href="https://create.t3.gg/en/introduction"
                        target="_blank"
                    >
                        <h3 className="text-2xl font-bold">Documentation</h3>
                        <div className="text-lg">
                            Learn more about Create T3 App, the libraries it
                            uses, and how to deploy it.
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl text-white">
                        {hello.data
                            ? hello.data.greeting
                            : "Loading tRPC query..."}
                    </p>
                    <div className="text-center text-lg text-white">
                        <AuthShowcase
                            session={props.serverSession}
                            initialData={props.secretMessage}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

function AuthShowcase(props: {
    session?: Session | null
    initialData?: RouterOutputs["example"]["getSecretMessage"]
}) {
    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        {
            enabled: Boolean(props.session?.user),
            initialData: props.initialData,
            staleTime: Infinity,
        }
    )

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {props.session && (
                    <span>Logged in as {props.session.user?.name}</span>
                )}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={
                    props.session ? () => void signOut() : () => void signIn()
                }
            >
                {props.session ? "Sign out" : "Sign in"}
            </button>
        </div>
    )
}
