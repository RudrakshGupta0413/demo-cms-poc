import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
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
    plugins: [],
})
