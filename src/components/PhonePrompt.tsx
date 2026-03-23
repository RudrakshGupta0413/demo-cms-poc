'use client'

import React, { useState } from 'react'

interface PhonePromptProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (phoneNumber: string) => void
}

export const PhonePrompt: React.FC<PhonePromptProps> = ({ isOpen, onClose, onSubmit }) => {
    const [phone, setPhone] = useState('')

    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: '#fff',
                padding: '32px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>One last thing</h2>
                <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
                    Please enter your phone number to continue with your order.
                </p>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#999' }}>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '2px solid #eee',
                            fontSize: '16px',
                            fontWeight: '600',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                        }}
                        autoFocus
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #eee',
                            background: '#fff',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => phone.length >= 10 && onSubmit(phone)}
                        disabled={phone.length < 10}
                        style={{
                            flex: 2,
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: phone.length >= 10 ? '#FFD814' : '#eee',
                            color: phone.length >= 10 ? '#0F1111' : '#999',
                            fontWeight: '700',
                            cursor: phone.length >= 10 ? 'pointer' : 'not-allowed',
                            boxShadow: phone.length >= 10 ? '0 2px 5px rgba(213,217,217,.5)' : 'none'
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
