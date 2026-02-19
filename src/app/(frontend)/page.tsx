import Link from 'next/link'

export default function Page() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
            <h1>Desi CMS</h1>
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                <Link href="/admin" style={{ padding: '10px 20px', background: '#333', color: '#fff', textDecoration: 'none', borderRadius: 4 }}>
                    Go to Admin
                </Link>
                <Link href="/process-of-dyeing/process" style={{ padding: '10px 20px', border: '1px solid #333', color: '#333', textDecoration: 'none', borderRadius: 4 }}>
                    Process of Dyeing
                </Link>
                <Link href="/blog/my-blog" style={{ padding: '10px 20px', border: '1px solid #333', color: '#333', textDecoration: 'none', borderRadius: 4 }}>
                    Blog
                </Link>
            </div>
        </main>
    )
}
