import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        livePreview: {
            collections: ['pages'],
            url: ({ data }) => {
                const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3010'
                return `${origin}/${data?.slug}?livePreview=true`
            },
            breakpoints: [
                { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
                { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
                { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
            ],
        },
        components: {
            // Components can be added here as needed for global admin customizations
        },
    },
    editor: lexicalEditor(),
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URL || '',
        },
    }),
    collections: [Users, Media, Pages],
    secret: process.env.PAYLOAD_SECRET || 'SETUP_YOUR_SECRET',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    sharp,
    plugins: [
        formBuilderPlugin({
            fields: {
                payment: false,
            },
            formOverrides: {
                admin: {
                    group: 'Config',
                },
            },
            formSubmissionOverrides: {
                admin: {
                    group: 'Config',
                },
                hooks: {
                    afterChange: [
                        async ({ doc, operation }) => {
                            if (operation === 'create') {
                                try {
                                    console.log('--- Form Submission Hook Triggered ---')
                                    console.log('Form ID:', doc.form)

                                    // Extract data from Payload's submissionData array robustly
                                    let jsonPayload: any = {}

                                    if (doc.submissionData && Array.isArray(doc.submissionData)) {
                                        doc.submissionData.forEach((item: any) => {
                                            const lowerField = (item.field || '').toLowerCase()
                                            const val = item.value || ''

                                            if (lowerField.includes('email')) {
                                                jsonPayload.email = val
                                            } else if (lowerField.includes('name') || lowerField.includes('first')) {
                                                jsonPayload.name = val
                                            } else if (lowerField.includes('phone')) {
                                                jsonPayload.phone = val
                                            } else {
                                                jsonPayload[item.field] = val
                                            }
                                        })
                                    }

                                    const synergyPayload = {
                                        workflow: "synergy",
                                        action: "waitlist",
                                        JSON_PAYLOAD: jsonPayload
                                    }

                                    console.log('Extracted final apiPayload:', synergyPayload)

                                    const response = await fetch('https://papi.misrut.com/papi/opn/synergy/waitlist', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json'
                                        },
                                        body: JSON.stringify(synergyPayload)
                                    })

                                    if (!response.ok) {
                                        const errorBody = await response.text()
                                        console.error('Synergy API returned an error:', response.status, errorBody)
                                    } else {
                                        console.log('Successfully submitted to Synergy Waitlist via Backend Hook.')
                                    }
                                } catch (error) {
                                    console.error('Failed to submit to Synergy Waitlist API from hook:', error)
                                }
                            }
                            return doc
                        }
                    ]
                }
            },
        }),
    ],
})
