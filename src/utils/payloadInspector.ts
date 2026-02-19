export type PayloadInspectorMessage =
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

export function postFocusToPayloadAdmin(
    msg: PayloadInspectorMessage,
    adminOrigin: string,
) {
    if (typeof window === 'undefined') return
    if (window.parent === window) return

    window.parent.postMessage(msg, adminOrigin)
}
