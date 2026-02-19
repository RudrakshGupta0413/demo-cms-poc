import Link from 'next/link'
import * as React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const Header = async () => {
    const payload = await getPayload({ config })
    const pagesResult = await payload.find({
        collection: 'pages',
        limit: 100,
        select: {
            title: true,
            slug: true,
        }
    })

    const pages = pagesResult.docs

    return (
        <header style={{
            padding: '15px 60px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderBottom: '1px solid #f0f0f0',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="header-left">
                {/* Empty for now or can add breadcrumbs */}
            </div>

            <Link href="/" style={{ fontSize: '1.8rem', fontWeight: '500', textDecoration: 'none', color: '#1a1a1a', fontFamily: 'Times New Roman, serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Charaka
            </Link>

            <nav style={{ display: 'flex', gap: 35, alignItems: 'center', justifyContent: 'flex-end' }}>
                {pages.map((page) => (
                    <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        style={{ textDecoration: 'none', color: '#333', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                        {page.title}
                    </Link>
                ))}
                <Link href="/admin" style={{ textDecoration: 'none', color: '#333', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'sans-serif', marginLeft: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid #333', padding: '6px 15px', borderRadius: '1px' }}>
                    Admin
                </Link>
            </nav>
        </header>
    )
}
