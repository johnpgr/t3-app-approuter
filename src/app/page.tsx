import { createTRPCCaller } from "~/utils/api-rsc"
import { HomePage } from "./home"
import { getServerSession } from "next-auth"
import { authOptions } from "~/server/auth"

export default async function Home() {
    const session = await getServerSession(authOptions)
    const caller = await createTRPCCaller(session)
    const hello = await caller.example.hello({
        text: "Trpc from server component",
    })
    const secretMessage = session
        ? await caller.example.getSecretMessage()
        : undefined

    return (
        <HomePage
            hello={hello}
            secretMessage={secretMessage}
            serverSession={session}
        />
    )
}
