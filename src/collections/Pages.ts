import type { CollectionConfig, Field } from 'payload'

const sectionFields: Field[] = [
    {
        name: 'heading',
        type: 'text',
        label: 'Section Heading',
    },
    {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
    },
    {
        name: 'content',
        type: 'richText',
        required: true,
    },
]

const stepFields: Field[] = [
    {
        name: 'heading',
        type: 'text',
        label: 'Step Heading (Centered)',
        required: true,
    },
    {
        name: 'description',
        type: 'textarea',
        label: 'Step Description (Centered)',
        required: true,
    },
    {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: 'Large Process Image',
        required: true,
    },
]

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'layoutType'],
        livePreview: {
            url: ({ data }) => {
                const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3010'
                return `${origin}/${data?.slug}?livePreview=true`
            },
        },
        components: {
            edit: {
                beforeDocumentControls: [
                    {
                        path: '@/components/payload/AdminInspectorBridge',
                    },
                ],
            },
        },
    },
    fields: [
        {
            name: 'changeLayout',
            type: 'ui',
            admin: {
                condition: (data) => !!data?.layoutType,
                components: {
                    Field: {
                        path: '@/components/payload/ChangeLayoutButton',
                    },
                },
            },
        },
        {
            name: 'layoutType',
            type: 'select',
            required: true,
            options: [
                { label: 'Blog Layout', value: 'blog' },
                { label: 'Process Layout', value: 'process' },
            ],
            admin: {
                // HIDE the selector once a layout is chosen
                condition: (data) => !data?.layoutType,
                components: {
                    Field: {
                        path: '@/components/payload/LayoutSelector',
                    },
                },
            },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            admin: {
                condition: (data) => !!data?.layoutType,
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                description: 'URL slug (e.g. "my-page").',
                condition: (data) => !!data?.layoutType,
            },
        },
        // COMMON HERO
        {
            name: 'hero',
            type: 'group',
            admin: {
                condition: (data) => !!data?.layoutType,
            },
            fields: [
                {
                    name: 'heading',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'subheading',
                    type: 'text',
                },
                {
                    name: 'backgroundImage',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
        // BLOG SPECIFIC FIELDS (FIXED SECTIONS)
        {
            name: 'section1',
            type: 'group',
            label: 'Blog Section 1',
            admin: {
                condition: (data) => data?.layoutType === 'blog',
            },
            fields: sectionFields,
        },
        {
            name: 'section2',
            type: 'group',
            label: 'Blog Section 2',
            admin: {
                condition: (data) => data?.layoutType === 'blog',
            },
            fields: sectionFields,
        },
        {
            name: 'section3',
            type: 'group',
            label: 'Blog Section 3',
            admin: {
                condition: (data) => data?.layoutType === 'blog',
            },
            fields: sectionFields,
        },
        {
            name: 'section4',
            type: 'group',
            label: 'Blog Section 4',
            admin: {
                condition: (data) => data?.layoutType === 'blog',
            },
            fields: sectionFields,
        },
        // PROCESS SPECIFIC FIELDS (FIXED STEPS)
        {
            name: 'step1',
            type: 'group',
            label: 'Process Step 1',
            admin: {
                condition: (data) => data?.layoutType === 'process',
            },
            fields: stepFields,
        },
        {
            name: 'step2',
            type: 'group',
            label: 'Process Step 2',
            admin: {
                condition: (data) => data?.layoutType === 'process',
            },
            fields: stepFields,
        },
        {
            name: 'step3',
            type: 'group',
            label: 'Process Step 3',
            admin: {
                condition: (data) => data?.layoutType === 'process',
            },
            fields: stepFields,
        },
        {
            name: 'step4',
            type: 'group',
            label: 'Process Step 4',
            admin: {
                condition: (data) => data?.layoutType === 'process',
            },
            fields: stepFields,
        },
        {
            name: 'discoverMore',
            type: 'group',
            label: 'Discover More Section',
            admin: {
                condition: (data) => data?.layoutType === 'process',
            },
            fields: [
                {
                    name: 'heading',
                    type: 'text',
                    defaultValue: 'Discover more',
                },
                // Fixed items instead of array
                {
                    name: 'item1',
                    type: 'group',
                    fields: [
                        { name: 'image', type: 'upload', relationTo: 'media', required: true },
                        { name: 'heading', type: 'text', required: true },
                        { name: 'link', type: 'text' },
                    ],
                },
                {
                    name: 'item2',
                    type: 'group',
                    fields: [
                        { name: 'image', type: 'upload', relationTo: 'media', required: true },
                        { name: 'heading', type: 'text', required: true },
                        { name: 'link', type: 'text' },
                    ],
                },
                {
                    name: 'item3',
                    type: 'group',
                    fields: [
                        { name: 'image', type: 'upload', relationTo: 'media', required: true },
                        { name: 'heading', type: 'text', required: true },
                        { name: 'link', type: 'text' },
                    ],
                },
            ],
        },
    ],
}
