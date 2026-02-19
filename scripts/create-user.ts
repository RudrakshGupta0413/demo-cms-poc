import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envPath = path.resolve(dirname, '../.env')
console.log(`Loading .env from: ${envPath}`)
const result = dotenv.config({ path: envPath })

if (result.error) {
    console.error('Error loading .env file', result.error)
}

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing')
    process.exit(1)
}

async function createAdmin() {
    try {
        // Dynamic imports to ensure env is loaded first
        const { default: config } = await import('../src/payload.config')
        const { getPayload } = await import('payload')

        console.log('Connecting to Payload...')
        const payload = await getPayload({ config })

        console.log('Checking for existing user...')
        const users = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: 'admin@desi.com',
                },
            },
        })

        if (users.totalDocs > 0) {
            console.log('Admin user already exists.')
            process.exit(0)
        }

        console.log('Creating admin user...')
        await payload.create({
            collection: 'users',
            data: {
                email: 'admin@desi.com',
                password: 'password123',
            },
        })

        console.log('Admin user created successfully: admin@desi.com / password123')
        process.exit(0)
    } catch (error) {
        console.error('Failed to create user:', error)
        process.exit(1)
    }
}

createAdmin()
