'use client'

import React from 'react'

interface MerchantHeaderProps {
    merchant: {
        MERCH_NAME: string
        MERCH_LOGO_PATH: string
        GOOGLE_RATING: number
        GOOGLE_RATING_COUNT: number
        SHORT_DESCRIPTION: string
        CITY: string | null
        ADDRESS: string
        IS_OPEN: boolean
    }
}

const IMAGE_BASE_URL = 'https://www.misrut.com/assets/img/'

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({ merchant }) => {
    return (
        <div className="merchant-header" style={{
            background: '#fff',
            borderBottom: '1px solid #eee',
            padding: '24px 0',
            marginBottom: '24px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', padding: '0 20px' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    flexShrink: 0
                }}>
                    <img
                        src={`${IMAGE_BASE_URL}${merchant.MERCH_LOGO_PATH}`}
                        alt={merchant.MERCH_NAME}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Logo'
                        }}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>{merchant.MERCH_NAME}</h1>
                        {merchant.IS_OPEN ? (
                            <span style={{
                                background: '#e6fffa',
                                color: '#2c7a7b',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}>Open Now</span>
                        ) : (
                            <span style={{
                                background: '#fff5f5',
                                color: '#c53030',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}>Closed</span>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{
                            background: '#FFF9E6',
                            color: '#855D00',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span>★</span>
                            <span>{merchant.GOOGLE_RATING}</span>
                        </div>
                        <span style={{ color: '#666', fontSize: '14px' }}>({merchant.GOOGLE_RATING_COUNT} reviews)</span>
                    </div>

                    <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                        {merchant.SHORT_DESCRIPTION}
                    </p>

                    <div style={{ color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📍</span>
                        <span>{merchant.ADDRESS}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
