'use client'

import * as React from 'react'

type FocusMsg =
    | {
        type: 'PAYLOAD_INSPECTOR_FOCUS'
        collectionSlug: string
        docID: string
        fieldPath: string
    }
    | {
        type: 'PAYLOAD_INSPECTOR_FOCUS_GLOBAL'
        globalSlug: string
        fieldPath: string
    }

const STORAGE_KEY = 'payload:pending-focus'

function getAdminOrigin(): string {
    // In a real app, you might want to validate this against an env var
    return window.location.origin
}

function currentEditContext() {
    const path = window.location.pathname
    const parts = path.split('/').filter(Boolean)

    const idxCollections = parts.indexOf('collections')
    if (idxCollections !== -1 && parts.length >= idxCollections + 3) {
        return {
            kind: 'collection' as const,
            collectionSlug: parts[idxCollections + 1],
            id: parts[idxCollections + 2],
        }
    }
    return { kind: 'unknown' as const }
}

function navigateToCollectionDoc(collectionSlug: string, docID: string) {
    const url = `/admin/collections/${collectionSlug}/${docID}`
    window.location.assign(url)
}

function focusField(fieldPath: string): boolean {
    const payloadId = `field-${fieldPath.replace(/\./g, '__')}`
    const dotPayloadId = `field-${fieldPath}`
    const selectors = [
        `#${CSS.escape(payloadId)}`,
        `#${CSS.escape(dotPayloadId)}`,
        `[name="${CSS.escape(fieldPath)}"]`,
        `[data-path="${CSS.escape(fieldPath)}"]`,
        `.field-type.rich-text[id*="${CSS.escape(fieldPath)}"]`, // Lexical might have specific IDs
    ]

    for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement | null
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // For Lexical/complex fields, we might need to find a nested focusable
            const focusable = el.querySelector('button, input, [contenteditable="true"]') as HTMLElement | null
            if (focusable) {
                focusable.focus()
            } else {
                el.focus()
            }
            return true
        }
    }
    return false
}

function focusFieldWithRetry(fieldPath: string, retries = 10, delayMs = 500) {
    let attempt = 0
    const tryFocus = () => {
        if (focusField(fieldPath)) return
        attempt += 1
        if (attempt < retries) setTimeout(tryFocus, delayMs)
    }
    tryFocus()
}

export default function AdminInspectorBridge() {
    React.useEffect(() => {
        const pendingRaw = sessionStorage.getItem(STORAGE_KEY)
        if (pendingRaw) {
            sessionStorage.removeItem(STORAGE_KEY)
            try {
                const pending = JSON.parse(pendingRaw) as FocusMsg
                setTimeout(() => focusFieldWithRetry(pending.fieldPath, 5, 200), 300)
            } catch { }
        }

        function onMessage(event: MessageEvent) {
            // In prod, check event.origin === expectedOrigin
            const data = event.data as FocusMsg
            if (!data || typeof data !== 'object') return

            const ctx = currentEditContext()

            if (data.type === 'PAYLOAD_INSPECTOR_FOCUS') {
                const sameDoc =
                    ctx.kind === 'collection' &&
                    ctx.collectionSlug === data.collectionSlug &&
                    String(ctx.id) === String(data.docID)

                if (sameDoc) {
                    focusFieldWithRetry(data.fieldPath)
                    return
                }

                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
                navigateToCollectionDoc(data.collectionSlug, String(data.docID))
                return
            }
        }

        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
    }, [])

    return null
}
