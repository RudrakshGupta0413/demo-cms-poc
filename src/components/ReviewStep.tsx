import React, { useEffect, useState } from 'react'
import { useCart } from './CartContext'

interface ReviewStepProps {
    orderId: number
    merchantId: number
    onConfirmed: () => void
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ orderId, merchantId, onConfirmed }) => {
    const { cartItems, totalAmount, updateQuantity, removeFromCart, userId } = useCart()
    const [reviewData, setReviewData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)

    const fetchReview = async () => {
        try {
            const reviewRes = await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "order",
                    action: "review",
                    MERCH_ID: Number(merchantId),
                    ORDER_ID: Number(orderId),
                    COUPON_CODE: null
                }),
            })
            const rData = await reviewRes.json()
            setReviewData(rData.DATA)
        } catch (err) {
            console.error("Review fetch error", err)
        } finally {
            setLoading(false)
            setSyncing(false)
        }
    }

    useEffect(() => {
        fetchReview()
    }, [orderId, merchantId])

    const syncCart = async (updatedItems: any[]) => {
        setSyncing(true)
        try {
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
                    ITEMS: updatedItems.map(i => ({
                        CUST_ORDER_DETAIL_ITEM_ID: Number(i.id),
                        CUST_ORDER_DETAIL_ITEM_NAME: i.name,
                        CUST_ORDER_DETAIL_ITEM_CODE: null,
                        CUST_ORDER_DETAIL_ITEM_PRICE: Number(i.price),
                        CUST_ORDER_DETAIL_QTY: Number(i.quantity)
                    })),
                    CUST_ORDER_STATUS: "PreBook"
                }),
            })
            await fetchReview()
        } catch (err) {
            console.error("Sync cart error", err)
            setSyncing(false)
        }
    }

    const handleQtyChange = (itemId: number, newQty: number) => {
        if (newQty < 1) {
            handleRemove(itemId)
            return
        }
        updateQuantity(itemId, newQty)
        const updatedItems = cartItems.map(i =>
            Number(i.id) === Number(itemId) ? { ...i, quantity: newQty } : i
        )
        syncCart(updatedItems)
    }

    const handleRemove = (itemId: number) => {
        removeFromCart(itemId)
        const updatedItems = cartItems.filter(i => Number(i.id) !== Number(itemId))
        syncCart(updatedItems)
    }

    return (
        <div className="review-step" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Review your order</h3>

            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '20px', marginBottom: '24px', opacity: syncing ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Items</h4>
                {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{item.name}</div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>₹{item.price} each</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', background: '#f9f9f9' }}>
                                <button
                                    onClick={() => handleQtyChange(Number(item.id), item.quantity - 1)}
                                    disabled={syncing}
                                    style={{ padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '600' }}
                                >
                                    -
                                </button>
                                <span style={{ fontSize: '14px', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                <button
                                    onClick={() => handleQtyChange(Number(item.id), item.quantity + 1)}
                                    disabled={syncing}
                                    style={{ padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '600' }}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleRemove(Number(item.id))}
                                disabled={syncing}
                                style={{ background: 'none', border: 'none', color: '#f5222d', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', position: 'relative', border: '1px solid #eee' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Price Summary</h4>

                {(loading && !reviewData) ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={summaryRowStyle}>
                            <span>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div style={{ ...summaryRowStyle, color: '#999' }}>
                            <span>Calculating backend charges...</span>
                            <span style={{ fontSize: '12px' }}>⏱️</span>
                        </div>
                        <div style={{ ...summaryRowStyle, borderTop: '1px solid #ddd', paddingTop: '16px', marginTop: '16px', color: '#999', fontSize: '18px', fontWeight: '800' }}>
                            <span>Order Total</span>
                            <span>₹{totalAmount}+</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={summaryRowStyle}>
                            <span>Items Total</span>
                            <span>₹{reviewData?.SUBTOTAL || totalAmount}</span>
                        </div>

                        {/* Discounts */}
                        {reviewData?.DISCOUNTS?.filter((d: any) => d.DISCOUNT_AMOUNT > 0).map((d: any, idx: number) => (
                            <div key={idx} style={{ ...summaryRowStyle, color: '#059669' }}>
                                <span>{d.DISCOUNT_NAME || 'Discount'}</span>
                                <span>-₹{d.DISCOUNT_AMOUNT}</span>
                            </div>
                        ))}
                        {reviewData?.DISCOUNT_TOTAL > 0 && !reviewData?.DISCOUNTS?.some((d: any) => d.DISCOUNT_AMOUNT > 0) && (
                            <div style={{ ...summaryRowStyle, color: '#059669' }}>
                                <span>Total Discount</span>
                                <span>-₹{reviewData.DISCOUNT_TOTAL}</span>
                            </div>
                        )}

                        {/* Charges */}
                        {reviewData?.CHARGES?.map((c: any) => (
                            <div key={c.CHARGE_ID} style={summaryRowStyle}>
                                <span>{c.CHARGE_NAME || c.CHARGE_GROUP} ({c.CHARGE_VALUE}%)</span>
                                <span>₹{c.ITEM_CHARGE}</span>
                            </div>
                        ))}

                        <div style={{ ...summaryRowStyle, borderTop: '1px solid #ddd', paddingTop: '16px', marginTop: '16px', color: '#B12704', fontSize: '18px', fontWeight: '800' }}>
                            <span>Order Total</span>
                            <span>₹{(syncing || loading) ? '...' : reviewData?.TOTAL}</span>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onConfirmed}
                disabled={syncing || cartItems.length === 0}
                style={{
                    width: '100%',
                    background: '#FFD814',
                    border: '1px solid #FCD200',
                    color: '#0F1111',
                    padding: '16px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '24px',
                    boxShadow: '0 2px 5px rgba(213,217,217,.5)',
                    opacity: (syncing || cartItems.length === 0) ? 0.6 : 1
                }}
            >
                Confirm Items & Proceed
            </button>
        </div>
    )
}

const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
}
