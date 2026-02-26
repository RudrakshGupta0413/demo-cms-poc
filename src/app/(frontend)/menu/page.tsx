'use client'

import React, { useEffect, useState } from 'react'

interface MenuItem {
    ITEM_ID: number
    ITEM_NAME: string
    ITEM_DESC: string | null
    ITEM_STATUS: string
    ITEM_PRICE: number
    ITEM_TAX: string | null
    ITEM_PHOTO_PATH: string[] | null
    TAG_NAME: string | null
    TAG_COLOUR: string | null
}

interface Category {
    CAT_ID: number
    CAT_NAME: string
    CAT_STATUS: string
    ITEMS: MenuItem[]
}

const IMAGE_BASE_URL = 'https://www.misrut.com/assets/img/'

export default function MenuPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch('/api/menu-proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        workflow: 'menu',
                        action: 'getMenuCustomer',
                        MERCH_ID: 1,
                    }),
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch menu data')
                }

                const data = await response.json()
                if (data.STATUS_CODE === 'MIS-200' && data.DATA && data.DATA.ITEMS) {
                    setCategories(data.DATA.ITEMS)
                } else {
                    throw new Error(data.STATUS_MESSAGE || 'Invalid API response structure')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
                <div style={{ width: '30px', height: '30px', border: '2px solid #f3f3f3', borderTop: '2px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
                <div style={{ color: '#ff4d4d', padding: '15px 25px', borderRadius: '8px', border: '1px solid #ffebeb', background: '#fff9f9', fontFamily: 'sans-serif' }}>
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff', padding: '60px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {categories.map((category) => (
                    <div key={category.CAT_ID} style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#000', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '-0.02em', borderBottom: '4px solid #000', paddingBottom: '5px', display: 'inline-block' }}>
                            {category.CAT_NAME}
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '24px'
                        }}>
                            {category.ITEMS.map((item) => (
                                <div
                                    key={item.ITEM_ID}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        border: '1px solid #f5f5f5',
                                        display: 'flex',
                                        height: '190px',
                                        position: 'relative',
                                        transition: 'transform 0.2s ease',
                                    }}
                                >
                                    {/* Left Info Section */}
                                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '6px', lineHeight: '1.2' }}>
                                            {item.ITEM_NAME}
                                        </h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#1a1a1a' }}>
                                                ₹{item.ITEM_PRICE}
                                            </span>
                                            {item.TAG_NAME && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill={item.TAG_COLOUR || "#999"}>
                                                        <path d="M12.89 1.45l8.1 8.09c.41.42.41 1.09 0 1.5l-8.09 8.1c-.42.41-1.09.41-1.5 0l-8.1-8.1a1.06 1.06 0 010-1.5l8.1-8.09c.41-.41 1.08-.41 1.49 0zM12.14 12.14a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                                    </svg>
                                                    <span
                                                        style={{
                                                            fontSize: '10px',
                                                            fontWeight: '900',
                                                            color: item.TAG_COLOUR || '#999',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em'
                                                        }}
                                                    >
                                                        {item.TAG_NAME}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p style={{
                                            fontSize: '11px',
                                            color: '#999',
                                            fontWeight: '500',
                                            lineHeight: '1.5',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            textTransform: 'uppercase'
                                        }}>
                                            {item.ITEM_DESC || ''}
                                        </p>
                                    </div>

                                    {/* Right Image Section */}
                                    <div style={{ width: '42%', position: 'relative', height: '100%', background: '#fafafa' }}>
                                        {item.ITEM_PHOTO_PATH && item.ITEM_PHOTO_PATH.length > 0 ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}${item.ITEM_PHOTO_PATH[0]}`}
                                                alt={item.ITEM_NAME}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Food'
                                                }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ddd">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Add to Cart Button */}
                                        <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
                                            <button style={{
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                borderRadius: '6px',
                                                padding: '8px 16px',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                color: '#333',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                <span style={{ fontSize: '18px', fontWeight: '300', color: '#666', marginTop: '-2px' }}>+</span>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
