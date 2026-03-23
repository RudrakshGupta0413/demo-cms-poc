'use client'

import React, { useState } from 'react'
import { useCart } from './CartContext'
import { AddressStep } from './AddressStep'
import { ReviewStep } from './ReviewStep'
import { PaymentStep } from './PaymentStep'

interface MultiStepCheckoutProps {
    isOpen: boolean
    onClose: () => void
    merchant: any
}

type Step = 'address' | 'review' | 'payment' | 'success'

export const MultiStepCheckout: React.FC<MultiStepCheckoutProps> = ({ isOpen, onClose, merchant }) => {
    const { orderId, userId, clearCart } = useCart()
    const [step, setStep] = useState<Step>('review')
    const [addrId, setAddrId] = useState<number | null>(null)
    const [confirmedReview, setConfirmedReview] = useState(false)

    if (!isOpen) return null

    const handleReviewConfirmed = () => {
        console.log("DEBUG: Review confirmed, moving to address step");
        setConfirmedReview(true)
        setStep('address')
    }

    const handleAddressSaved = (id: number) => {
        console.log("DEBUG: MultiStepCheckout received addrId:", id);
        setAddrId(id)
        setStep('payment')
    }

    const handleOrderSuccess = () => {
        console.log("DEBUG: Order success, clearing cart");
        setStep('success')
        clearCart()
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px',
                background: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Checkout</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', height: '4px' }}>
                    <div style={{ flex: 1, background: '#0F1111', opacity: 1 }}></div>
                    <div style={{ flex: 1, background: '#0F1111', opacity: (step === 'address' || step === 'payment' || step === 'success') ? 1 : 0.1 }}></div>
                    <div style={{ flex: 1, background: '#0F1111', opacity: (step === 'payment' || step === 'success') ? 1 : 0.1 }}></div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {step === 'address' && (
                        <AddressStep
                            userId={userId!}
                            merchantCoords={{ lat: merchant.LAT, long: merchant.LONG }}
                            onAddressSaved={handleAddressSaved}
                            onBack={() => setStep('review')}
                        />
                    )}

                    {step === 'review' && (
                        <ReviewStep
                            orderId={Number(orderId)}
                            merchantId={Number(merchant.MERCH_ID)}
                            onConfirmed={handleReviewConfirmed}
                        />
                    )}

                    {step === 'payment' && (
                        <PaymentStep
                            orderId={Number(orderId)}
                            merchantId={Number(merchant.MERCH_ID)}
                            userId={userId!}
                            addrId={addrId!}
                            phone={merchant.MERCH_PHONE || ""}
                            lat={Number(merchant.LAT) || 0}
                            long={Number(merchant.LONG) || 0}
                            userName="User"
                            onSuccess={handleOrderSuccess}
                            onBack={() => setStep('address')}
                        />
                    )}

                    {step === 'success' && (
                        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🍕</div>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>Order Placed!</h2>
                            <p style={{ color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
                                Your order has been successfully placed and is now "Pending" with the merchant.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    background: '#0F1111',
                                    color: '#fff',
                                    padding: '16px 32px',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Track Order
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
