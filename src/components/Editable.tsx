'use client'

import React, { useEffect, useState } from 'react'
import { postFocusToPayloadAdmin } from '@/utils/payloadInspector'

type EditableProps = {
    collectionSlug: string
    docID: string
    fieldPath: string
    adminOrigin: string
    children: React.ReactNode
}

export function Editable({
    collectionSlug,
    docID,
    fieldPath,
    adminOrigin,
    children,
}: EditableProps) {
    const [isPreviewActive, setIsPreviewActive] = useState(false)

    useEffect(() => {
        const isPreview =
            new URLSearchParams(window.location.search).has('livePreview') || window.self !== window.top
        setIsPreviewActive(isPreview)
    }, [])

    if (!isPreviewActive) return <>{children}</>

    return (
        <div
            data-editable-preview
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                postFocusToPayloadAdmin(
                    { type: 'PAYLOAD_INSPECTOR_FOCUS', collectionSlug, docID, fieldPath },
                    adminOrigin,
                )
            }}
            style={{
                cursor: 'pointer',
                borderRadius: '2px',
                outline: '1px solid transparent',
                outlineOffset: '2px',
                transition: 'outline-color 0.15s ease',
                display: 'block',
                position: 'relative',
                zIndex: 1,
            }}
            title="Click to focus this field in the admin"
            onMouseEnter={(e) => {
                e.currentTarget.style.outlineColor = 'var(--editable-outline, rgba(55, 201, 176, 0.5))'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.outlineColor = 'transparent'
            }}
        >
            {children}
        </div>
    )
}
