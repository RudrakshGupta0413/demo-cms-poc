import { LivePreviewBlog } from '@/components/LivePreviewBlog'
import { LivePreviewProcessOfDyeing } from '@/components/LivePreviewProcessOfDyeing'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
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

    const page = result?.docs?.[0]

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
