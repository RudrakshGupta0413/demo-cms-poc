import Link from 'next/link'
import * as React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const Header = async () => {
    const payload = await getPayload({ config })

    // Get nav items from the Header global
    const headerGlobal = await payload.findGlobal({ slug: 'header' })
    const navItems = (headerGlobal as any)?.navItems || []

    // Build pages list from global nav items only
    const pages = navItems
        .filter((item: any) => item.page)
        .map((item: any) => {
            const page = typeof item.page === 'object' ? item.page : null
            if (!page) return null
            return {
                id: page.id,
                title: item.label || page.title,
                slug: page.slug,
            }
        })
        .filter(Boolean)

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
                {pages.map((page: any) => (
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
