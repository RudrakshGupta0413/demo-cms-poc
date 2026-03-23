import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
    slug: 'header',
    label: 'Header',
    fields: [
        {
            name: 'navItems',
            type: 'array',
            label: 'Navigation Items',
            admin: {
                description: 'Select which pages to show in the header navigation and their order.',
            },
            fields: [
                {
                    name: 'page',
                    type: 'relationship',
                    relationTo: 'pages',
                    required: true,
                    label: 'Page',
                },
                {
                    name: 'label',
                    type: 'text',
                    label: 'Custom Label (optional)',
                    admin: {
                        description: 'Leave blank to use the page title',
                    },
                },
            ],
        },
    ],
}
