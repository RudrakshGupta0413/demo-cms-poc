'use client'

import React, { useRef, useState, useEffect } from 'react'

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

interface CategorizedMenuProps {
    categories: Category[]
    onAddItem: (item: MenuItem) => void
    cartItems: any[]
    onUpdateQuantity: (itemId: number, newQty: number) => void
    onRemoveItem: (itemId: number) => void
}

const IMAGE_BASE_URL = 'https://www.misrut.com/assets/img/'

export const CategorizedMenu: React.FC<CategorizedMenuProps> = ({
    categories,
    onAddItem,
    cartItems,
    onUpdateQuantity,
    onRemoveItem
}) => {
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.CAT_ID)
    const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

    const scrollToCategory = (id: number) => {
        const element = categoryRefs.current[id]
        if (element) {
            const offset = 100 // Height of header + nav
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            let current = categories[0]?.CAT_ID
            for (const category of categories) {
                const element = categoryRefs.current[category.CAT_ID]
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 150) {
                        current = category.CAT_ID
                    }
                }
            }
            setActiveCategory(current)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [categories])

    const getCartItem = (itemId: number) => {
        return cartItems.find(i => Number(i.id) === Number(itemId))
    }

    return (
        <div className="categorized-menu">
            {/* Sticky Category Nav */}
            <div style={{
                position: 'sticky',
                top: '0',
                background: '#fff',
                zIndex: 10,
                borderBottom: '1px solid #eee',
                padding: '12px 0',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '20px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.CAT_ID}
                            onClick={() => scrollToCategory(cat.CAT_ID)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '8px 4px',
                                fontSize: '14px',
                                fontWeight: activeCategory === cat.CAT_ID ? '700' : '500',
                                color: activeCategory === cat.CAT_ID ? '#000' : '#666',
                                borderBottom: activeCategory === cat.CAT_ID ? '2px solid #000' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {cat.CAT_NAME}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                {categories.map(category => (
                    <div
                        key={category.CAT_ID}
                        ref={el => { categoryRefs.current[category.CAT_ID] = el }}
                        style={{ marginBottom: '48px' }}
                    >
                        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {category.CAT_NAME}
                            <span style={{ fontSize: '13px', color: '#999', fontWeight: '400' }}>({category.ITEMS.length})</span>
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '24px'
                        }}>
                            {category.ITEMS.map(item => {
                                const cartItem = getCartItem(item.ITEM_ID)
                                return (
                                    <div
                                        key={item.ITEM_ID}
                                        style={{
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#fff',
                                            transition: 'box-shadow 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                        className="item-card"
                                    >
                                        <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                                            {item.ITEM_PHOTO_PATH && item.ITEM_PHOTO_PATH.length > 0 ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}${item.ITEM_PHOTO_PATH[0]}`}
                                                    alt={item.ITEM_NAME}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Food'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '32px' }}>🍽️</span>
                                                </div>
                                            )}
                                            {item.TAG_NAME && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    background: item.TAG_COLOUR || '#333',
                                                    color: '#fff',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {item.TAG_NAME}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>{item.ITEM_NAME}</h3>
                                            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 16px 0', lineHeight: '1.4', flex: 1 }}>
                                                {item.ITEM_DESC}
                                            </p>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                                <span style={{ fontSize: '18px', fontWeight: '800' }}>₹{item.ITEM_PRICE}</span>

                                                {cartItem ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', background: '#FFD814', borderRadius: '20px', padding: '4px 12px', gap: '12px', boxShadow: '0 2px 5px rgba(213,217,217,.5)' }}>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.ITEM_ID, cartItem.quantity - 1)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '800', color: '#0F1111', padding: '0 4px' }}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ fontSize: '14px', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>
                                                            {cartItem.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.ITEM_ID, cartItem.quantity + 1)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '800', color: '#0F1111', padding: '0 4px' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => onAddItem(item)}
                                                        style={{
                                                            background: '#FFD814',
                                                            border: '1px solid #FCD200',
                                                            color: '#0F1111',
                                                            padding: '8px 24px',
                                                            borderRadius: '20px',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            boxShadow: '0 2px 5px rgba(213,217,217,.5)'
                                                        }}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
