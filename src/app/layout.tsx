import React from "react"
import { Providers } from "~/providers"
import "~/styles/globals.css"

export const metadata = {
    title: {
        default: "Create T3 App",
        template: "%s | Create T3 App",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
