'use client'

import React from 'react'
import Link from 'next/link'

export default function FormSuccessPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1 style={{ color: '#22c55e', fontSize: '2.5rem', marginBottom: '1rem' }}>Success!</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>
                Your response has been submitted.
            </p>
            <Link href="/" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 'bold'
            }}>
                Back to Home
            </Link>
        </div>
    )
}
