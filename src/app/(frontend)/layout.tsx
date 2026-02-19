import * as React from 'react'
import '../(payload)/custom.css'
import { Header } from '@/components/Header'

export const metadata = {
    title: 'Desi CMS',
    description: 'Desi CMS Website',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                <Header />
                {children}
            </body>
        </html>
    )
}

