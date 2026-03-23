'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image?: string
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (itemId: number) => void
    updateQuantity: (itemId: number, quantity: number) => void
    clearCart: () => void
    totalAmount: number
    itemCount: number
    orderId: string | null
    userId: number | null
    orderStatus: string | null
    setOrderId: (id: string | null) => void
    setUserId: (id: number | null) => void
    setOrderStatus: (status: string | null) => void
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [orderId, setOrderId] = useState<string | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [orderStatus, setOrderStatus] = useState<string | null>(null)
    const [isCartOpen, setIsCartOpen] = useState(false)

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...item, quantity: 1 }]
        })
        setIsCartOpen(true) // Open cart when item added
    }

    const removeFromCart = (itemId: number) => {
        setCartItems(prev => prev.filter(i => i.id !== itemId))
    }

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId)
            return
        }
        setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
    }

    const clearCart = () => {
        setCartItems([])
        setOrderId(null)
        setUserId(null)
        setOrderStatus(null)
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            itemCount,
            orderId,
            userId,
            orderStatus,
            setOrderId,
            setUserId,
            setOrderStatus,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
