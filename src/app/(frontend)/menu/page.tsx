'use client'

import React, { useEffect, useState } from 'react'
import { useCart } from '@/components/CartContext'
import { MerchantHeader } from '@/components/MerchantHeader'
import { CategorizedMenu } from '@/components/CategorizedMenu'
import { PhonePrompt } from '@/components/PhonePrompt'
import { MultiStepCheckout } from '@/components/MultiStepCheckout'

export default function MenuPage() {
    const {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        orderId,
        setOrderId,
        userId,
        setUserId,
        setOrderStatus,
        itemCount,
        isCartOpen,
        setIsCartOpen
    } = useCart()

    const [merchant, setMerchant] = useState<any>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [isServiceable, setIsServiceable] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // UI State
    const [isPhonePromptOpen, setIsPhonePromptOpen] = useState(false)
    const [pendingItem, setPendingItem] = useState<any>(null)

    // Initial Discovery Calls
    useEffect(() => {
        const initDiscovery = async () => {
            try {
                // 1. userVisits Analytics (Non-blocking)
                fetch('/api/menu-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workflow: "analytics",
                        action: "userVisits",
                        UNIQUE_URL: "xyz.com",
                        PLATFORM_TYPE: "web",
                        BROWSER_FINGERPRINT: navigator.userAgent
                    }),
                })

                // Run Merchant and Menu calls in parallel
                const [merchRes, menuRes] = await Promise.all([
                    fetch('/api/menu-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            workflow: "merchant",
                            action: "getMerchantByUniqueCred",
                            MERCH_UNIQUE_URL: "xyz.com"
                        }),
                    }),
                    fetch('/api/menu-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            workflow: "menu",
                            action: "getMenuCustomer",
                            MERCH_ID: 1 // Starting with default ID for speed
                        }),
                    })
                ])

                const merchData = await merchRes.json()
                const menuData = await menuRes.json()
                console.log("DEBUG: Merchant Response:", merchData);
                console.log("DEBUG: Menu Response:", menuData);

                if (merchData.DATA) {
                    setMerchant(merchData.DATA)
                    // Skip redundant availability check as per user request
                    setIsServiceable(true)
                }

                if (menuData.DATA?.ITEMS) {
                    setCategories(menuData.DATA.ITEMS)
                } else {
                    throw new Error(`Menu data unavailable: ${menuData.STATUS_MESSAGE || 'Unknown error'}`)
                }

            } catch (err) {
                console.error("Discovery error:", err)
                setError(err instanceof Error ? err.message : 'An error occurred during discovery')
            } finally {
                setLoading(false)
            }
        }

        initDiscovery()
    }, [])

    const syncCartWithBackend = async (updatedItems: any[]) => {
        try {
            await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "order",
                    action: "update",
                    MERCH_ID: Number(merchant?.MERCH_ID) || 1,
                    USER_ID: Number(userId),
                    CUST_ORDER_ID: Number(orderId),
                    ITEMS: updatedItems.map(i => ({
                        CUST_ORDER_DETAIL_ITEM_ID: Number(i.id || i.ITEM_ID),
                        CUST_ORDER_DETAIL_ITEM_NAME: i.name || i.ITEM_NAME,
                        CUST_ORDER_DETAIL_ITEM_CODE: null,
                        CUST_ORDER_DETAIL_ITEM_PRICE: Number(i.price || i.ITEM_PRICE),
                        CUST_ORDER_DETAIL_QTY: Number(i.quantity)
                    })),
                    CUST_ORDER_STATUS: "PreBook"
                }),
            })
        } catch (err) {
            console.error("Failed to sync cart", err)
        }
    }

    const handleAddItem = async (item: any) => {
        if (!orderId) {
            setPendingItem(item)
            setIsPhonePromptOpen(true)
        } else {
            const existing = cartItems.find(i => Number(i.id) === Number(item.ITEM_ID))
            let updatedItems;

            if (existing) {
                updatedItems = cartItems.map(i =>
                    Number(i.id) === Number(item.ITEM_ID) ? { ...i, quantity: i.quantity + 1 } : i
                )
            } else {
                updatedItems = [
                    ...cartItems,
                    {
                        id: item.ITEM_ID,
                        name: item.ITEM_NAME,
                        price: item.ITEM_PRICE,
                        quantity: 1,
                        image: item.ITEM_PHOTO_PATH?.[0] ? `https://www.misrut.com/assets/img/${item.ITEM_PHOTO_PATH[0]}` : undefined
                    }
                ]
            }

            // Update local cart
            addToCart({
                id: item.ITEM_ID,
                name: item.ITEM_NAME,
                price: item.ITEM_PRICE,
                quantity: 1,
                image: item.ITEM_PHOTO_PATH?.[0] ? `https://www.misrut.com/assets/img/${item.ITEM_PHOTO_PATH[0]}` : undefined
            })

            // Sync backend
            syncCartWithBackend(updatedItems)
        }
    }

    const handleUpdateQuantity = (itemId: number, newQty: number) => {
        if (newQty < 1) {
            handleRemoveItem(itemId)
            return
        }
        updateQuantity(itemId, newQty)
        const updatedItems = cartItems.map(i =>
            Number(i.id) === Number(itemId) ? { ...i, quantity: newQty } : i
        )
        syncCartWithBackend(updatedItems)
    }

    const handleRemoveItem = (itemId: number) => {
        removeFromCart(itemId)
        const updatedItems = cartItems.filter(i => Number(i.id) !== Number(itemId))
        syncCartWithBackend(updatedItems)
    }

    const handlePhoneSubmit = async (phone: string) => {
        setIsPhonePromptOpen(false)
        if (!pendingItem) return

        console.log("DEBUG: Creating order for item:", pendingItem);
        console.log("DEBUG: Current merchant state:", merchant);

        setLoading(true)
        try {
            // 5. create Order (PreBook)
            const createRes = await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    MERCH_ID: Number(merchant?.MERCH_ID) || 1,
                    USER_ID: null,
                    CUST_ORDER_ID: null,
                    CUST_ORDER_PHONE: phone,
                    ADDR_ID: null,
                    COUPON_CODE: null,
                    CUSTOM_MSG: null,
                    CUST_ADDR_LAT: 19.00708165220864,
                    CUST_ADDR_LONG: 73.11452178114182,
                    CUST_ORDER_ADDRESS: null,
                    CUST_ORDER_DESC: null,
                    CUST_ORDER_STATUS: "PreBook",
                    CUST_ORDER_TYPE: "Delivery",
                    ITEMS: [{
                        CUST_ORDER_DETAIL_ITEM_ID: Number(pendingItem.ITEM_ID),
                        CUST_ORDER_DETAIL_ITEM_NAME: pendingItem.ITEM_NAME,
                        CUST_ORDER_DETAIL_ITEM_CODE: null,
                        CUST_ORDER_DETAIL_ITEM_PRICE: Number(pendingItem.ITEM_PRICE),
                        CUST_ORDER_DETAIL_QTY: 1
                    }],
                    UNIQUE_STRING: null,
                    USER_FIRST_NAME: "",
                    USER_LAST_NAME: "",
                    action: "create",
                    workflow: "order",
                    endpoint: "/opn"
                }),
            })
            const createData = await createRes.json()

            if (createData.error) {
                const detailStr = createData.details ? JSON.stringify(createData.details) : (createData.message || '')
                throw new Error(`${createData.error}: ${detailStr}`)
            }

            if (!createData.DATA || !createData.DATA.CUST_ORDER_ID) {
                throw new Error(`Order creation failed: ${createData.STATUS_MESSAGE || 'No data returned'}`)
            }

            const newOrderId = createData.DATA.CUST_ORDER_ID
            const newUserId = createData.DATA.USER_ID

            setOrderId(newOrderId)
            setUserId(newUserId)
            setOrderStatus("PreBook")

            // 6. pinMerchant
            await fetch('/api/menu-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: "/opn",
                    workflow: "user",
                    action: "pinMerchant",
                    MERCH_ID: Number(merchant?.MERCH_ID) || 1,
                    USER_ID: newUserId,
                    STATUS: "2"
                }),
            })

            // Finalize local cart
            addToCart({
                id: pendingItem.ITEM_ID,
                name: pendingItem.ITEM_NAME,
                price: pendingItem.ITEM_PRICE,
                quantity: 1,
                image: pendingItem.ITEM_PHOTO_PATH?.[0] ? `https://www.misrut.com/assets/img/${pendingItem.ITEM_PHOTO_PATH[0]}` : undefined
            })

        } catch (err) {
            console.error("Create order error:", err)
            setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.')
        } finally {
            setLoading(false)
            setPendingItem(null)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
                <div className="amazon-spinner" style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #FEB81C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
                <div style={{ padding: '24px', background: '#FEF2F2', border: '1px solid #F87171', borderRadius: '12px', color: '#B91C1C', textAlign: 'center', maxWidth: '400px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontWeight: '800' }}>Something went wrong</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fcfcfc', fontFamily: 'Inter, sans-serif' }}>
            {merchant && (
                <>
                    <MerchantHeader merchant={merchant} />
                    {!isServiceable && (
                        <div style={{ background: '#FFF5F5', color: '#C53030', padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '700', borderBottom: '1px solid #FED7D7' }}>
                            ⚠️ Delivery is currently unavailable in your location. You can still browse and pre-book.
                        </div>
                    )}
                    <CategorizedMenu
                        categories={categories}
                        onAddItem={handleAddItem}
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                    />
                    <MultiStepCheckout
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                        merchant={merchant}
                    />
                </>
            )}

            <PhonePrompt
                isOpen={isPhonePromptOpen}
                onClose={() => setIsPhonePromptOpen(false)}
                onSubmit={handlePhoneSubmit}
            />

            {/* Floating Cart (Amazon themed) */}
            {itemCount > 0 && (
                <div
                    onClick={() => setIsCartOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0F1111',
                        color: '#fff',
                        padding: '16px 32px',
                        borderRadius: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        zIndex: 100,
                        fontWeight: '700'
                    }}>
                    <div style={{ background: '#FEB81C', color: '#000', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {itemCount}
                    </div>
                    <span>Proceed to Checkout</span>
                </div>
            )}
        </div>
    )
}
