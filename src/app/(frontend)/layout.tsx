import * as React from 'react'
import '../(payload)/custom.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/components/CartContext'

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
                <CartProvider>
                    <Header />
                    {children}
                    <Footer />
                </CartProvider>
            </body>
        </html>
    )
}
