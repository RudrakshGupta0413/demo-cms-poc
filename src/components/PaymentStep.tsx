'use client'

import React, { useState } from 'react'

interface PaymentStepProps {
    orderId: number
    merchantId: number
    userId: number
    addrId: number
    phone: string
    lat: number
    long: number
    userName: string
    onSuccess: () => void
    onBack: () => void
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
    orderId, merchantId, userId, addrId, phone, lat, long, userName, onSuccess, onBack
}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handlePlaceOrder = async () => {
        setLoading(true)
        try {
            // 12. addPaymentMethod (COD = 1)
            await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "order",
                    action: "addPaymentMethod",
                    CUST_ORDER_ID: Number(orderId),
                    ORDER_PAYMENT_METHOD: 1
                }),
            })

            // 13. update to Pending
            await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "order",
                    action: "update",
                    MERCH_ID: Number(merchantId),
                    USER_ID: Number(userId),
                    CUST_ORDER_ID: Number(orderId),
                    CUST_ORDER_PHONE: phone,
                    ADDR_ID: Number(addrId),
                    CUST_ORDER_STATUS: "Pending",
                    CUST_ORDER_TYPE: "Delivery",
                    CUST_ADDR_LAT: Number(lat),
                    CUST_ADDR_LONG: Number(long),
                    USER_FIRST_NAME: userName,
                    PLATFORM_TYPE: "web"
                }),
            })

            onSuccess()
        } catch (err) {
            setError('Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="payment-step" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={onBack}
                    style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ←
                </button>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Select Payment Method</h3>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                <div style={{
                    border: '2px solid #000',
                    background: '#f9f9f9',
                    padding: '24px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer'
                }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '6px solid #000' }}></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '800', fontSize: '16px' }}>Cash on Delivery</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>Pay when your food arrives</div>
                    </div>
                </div>

                <div style={{
                    border: '1px solid #ddd',
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    opacity: 0.6,
                    cursor: 'not-allowed'
                }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ddd' }}></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '16px' }}>Online Payment</div>
                        <div style={{ color: '#999', fontSize: '12px' }}>Not available for this merchant</div>
                    </div>
                </div>
            </div>

            {error && <p style={{ color: '#B91C1C', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

            <button
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{
                    width: '100%',
                    background: '#FEB81C',
                    border: 'none',
                    color: '#000',
                    padding: '16px',
                    borderRadius: '30px',
                    fontWeight: '800',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(254,184,28,0.3)'
                }}
            >
                {loading ? 'Placing Order...' : 'Place Order'}
            </button>
        </div>
    )
}
