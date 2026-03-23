import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
    slug: 'footer',
    label: 'Footer',
    fields: [
        {
            name: 'logo',
            type: 'group',
            label: 'Brand',
            fields: [
                {
                    name: 'text',
                    type: 'text',
                    label: 'Logo Text',
                    defaultValue: 'Desi',
                },
                {
                    name: 'tagline',
                    type: 'text',
                    label: 'Tagline',
                    defaultValue: 'Developing Ecologically Sustainable Industry',
                },
            ],
        },
        {
            name: 'quickLinks',
            type: 'array',
            label: 'Quick Links',
            fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
            ],
        },
        {
            name: 'companyLinks',
            type: 'array',
            label: 'Company Links',
            fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
            ],
        },
        {
            name: 'helpLinks',
            type: 'array',
            label: 'Help Links',
            fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
            ],
        },
        {
            name: 'enquiryText',
            type: 'text',
            label: 'Enquiry Text',
            defaultValue: 'Call us on 7012888185',
        },
        {
            name: 'copyrightText',
            type: 'text',
            label: 'Copyright Text',
            defaultValue: '© All rights reserved',
        },
        {
            name: 'socialLinks',
            type: 'group',
            label: 'Social Media Links',
            fields: [
                { name: 'facebook', type: 'text', label: 'Facebook URL' },
                { name: 'instagram', type: 'text', label: 'Instagram URL' },
                { name: 'twitter', type: 'text', label: 'X (Twitter) URL' },
                { name: 'youtube', type: 'text', label: 'YouTube URL' },
            ],
        },
    ],
}
