'use client'

import { useRowLabel } from '@payloadcms/ui'

export const BlogSectionRowLabel = () => {
    const { data, index } = useRowLabel<{ heading?: string }>()

    const label = data?.heading || `Section ${String((index ?? 0) + 1).padStart(2, '0')}`

    return <>{label}</>
}
