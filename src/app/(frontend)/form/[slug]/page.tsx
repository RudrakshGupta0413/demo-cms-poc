import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { FormBuilder } from '@/components/FormBuilder'

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function FormPage({ params }: PageProps) {
    const { slug } = await params
    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'forms' as any, // 'forms' is added by the plugin
        where: {
            title: {
                equals: slug,
            },
        },
    })

    const form = result?.docs?.[0]

    if (!form) {
        return notFound()
    }

    return (
        <div style={{
            padding: '4rem 2rem',
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>
            <FormBuilder form={form} />
        </div>
    )
}

export async function generateStaticParams() {
    const payload = await getPayload({ config })
    const forms = await payload.find({
        collection: 'forms' as any,
        limit: 1000,
    })

    return forms.docs.map((form: any) => ({
        slug: form.title,
    }))
}
