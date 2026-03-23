import { LivePreviewBlog } from '@/components/LivePreviewBlog'
import { LivePreviewProcessOfDyeing } from '@/components/LivePreviewProcessOfDyeing'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

async function getPage(slug: string) {
    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug,
            },
        },
        depth: 2,
    })
    return result?.docs?.[0] || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const page = await getPage(slug) as any

    if (!page) return {}

    const meta = page?.meta || {}
    const metaImage = meta.image as any

    return {
        title: meta.title || page.title || '',
        description: meta.description || '',
        openGraph: {
            title: meta.title || page.title || '',
            description: meta.description || '',
            ...(metaImage?.url && {
                images: [{ url: metaImage.url }],
            }),
        },
    }
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const page = await getPage(slug)

    if (!page) {
        return notFound()
    }

    if (page.layoutType === 'blog') {
        return <LivePreviewBlog initialPage={page} />
    }

    if (page.layoutType === 'process') {
        return <LivePreviewProcessOfDyeing initialPage={page} />
    }

    return notFound()
}

export async function generateStaticParams() {
    const payload = await getPayload({ config })
    const pages = await payload.find({
        collection: 'pages',
        limit: 1000,
    })

    return pages.docs.map(({ slug }) => ({
        slug,
    }))
}
