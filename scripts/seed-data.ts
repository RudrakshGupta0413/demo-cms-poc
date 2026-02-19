import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envPath = path.resolve(dirname, '../.env')
dotenv.config({ path: envPath })

async function seed() {
    try {
        const { default: config } = await import('../src/payload.config')
        const { getPayload } = await import('payload')

        const payload = await getPayload({ config })

        console.log('Seeding media...')
        // Check if any media exists
        const existingMedia = await payload.find({
            collection: 'media',
            limit: 1,
        })

        let mediaId
        if (existingMedia.totalDocs > 0) {
            mediaId = existingMedia.docs[0].id
            console.log('Using existing media:', mediaId)
        } else {
            // Create valid 1x1 png buffer
            // 1x1 pixel PNG red
            const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKw3qAAAAABJRU5ErkJggg==', 'base64')

            const media = await payload.create({
                collection: 'media',
                data: {
                    alt: 'Placeholder',
                },
                file: {
                    data: buffer,
                    name: 'placeholder.png',
                    mimetype: 'image/png',
                    size: buffer.length,
                },
            })
            mediaId = media.id
            console.log('Created placeholder media:', mediaId)
        }

        console.log('Seeding Blog...')
        const existingBlog = await payload.find({
            collection: 'blog',
            where: {
                slug: {
                    equals: 'my-blog',
                },
            },
        })

        if (existingBlog.totalDocs === 0) {
            const sections = []
            for (let i = 0; i < 5; i++) {
                sections.push({
                    heading: i === 0 || i === 2 ? "Where Does Charaka's Story Begin?" : "An Integrated Production Process",
                    image: mediaId,
                    content: {
                        root: {
                            type: 'root',
                            format: '',
                            indent: 0,
                            version: 1,
                            children: [
                                {
                                    type: 'paragraph',
                                    format: '',
                                    indent: 0,
                                    version: 1,
                                    children: [
                                        {
                                            mode: 'normal',
                                            text: 'The Charaka story begins with the vision to create sustainable textiles deeply rooted in community. From the spinning of the yarn to the final weave, every step is a testament to the dedication of our artisans.',
                                            type: 'text',
                                            version: 1,
                                        }
                                    ],
                                },
                            ],
                        },
                    },
                })
            }

            await payload.create({
                collection: 'blog',
                data: {
                    title: 'My Blog',
                    slug: 'my-blog',
                    hero: {
                        heading: 'The Heart and Craft of India',
                        subheading: 'Exploring the rich traditions of handloom and natural dyeing.',
                        backgroundImage: mediaId,
                    },
                    sections,
                },
            })
            console.log('Created Blog: my-blog')
        } else {
            console.log('Blog already exists')
        }

        console.log('Seeding Process of Dyeing...')
        // Just ensure it exists
        const existingProcess = await payload.find({
            collection: 'process-of-dyeing',
            where: {
                slug: {
                    equals: 'my-process',
                },
            },
        })

        if (existingProcess.totalDocs === 0) {
            // ... existing creation logic ...
            // (Reuse the processSteps variable defined above, but I need to define it outside the if block or repeat it)
            // Actually, I'll rewrite this block to define steps first.
        }

        // Define Process Chain
        const processChain = [
            {
                image: mediaId,
                heading: "Where does Charaka's story begin?",
                description: "The Charaka project was started in 1997 by Prasanna, a well-known activist and theatre personality, with the idea of providing employment to a large number of weavers, and offering simple and affordable handloom sarees, fabrics and clothing to a wider customer base, with the conviction that handloom products should be accessible to all. The project questions the myth that handloom textiles are expensive and are best suited for elite urban markets. Often these textiles are expensive because of multiple overheads added to the product before it reaches the customer through high-fashion boutiques in urban centres.",
            },
            {
                image: mediaId,
                heading: 'Natural Ingredients',
                description: 'Natural ingredients like indigo, madder root, and pomegranate peel are processed to extract vibrant, eco-friendly pigments. We use traditional methods passed down through generations.',
            },
            {
                image: mediaId,
                heading: 'The Dyeing Process',
                description: 'Expert artisans dip the yarns into the dye baths, carefully controlling temperature and timing. The yarn is then dried naturally under the sun to set the colors.',
            },
        ]
        // Define Discover More
        const discoverMore = {
            heading: 'Discover more',
            items: [
                {
                    image: mediaId,
                    heading: 'Our Artisans',
                    link: '/artisans'
                },
                {
                    image: mediaId,
                    heading: 'Sustainability',
                    link: '/sustainability'
                },
                {
                    image: mediaId,
                    heading: 'Collections',
                    link: '/collections'
                }
            ]
        }

        if (existingProcess.totalDocs === 0) {
            await payload.create({
                collection: 'process-of-dyeing',
                data: {
                    title: 'My Process',
                    slug: 'my-process',
                    hero: {
                        heading: 'Natural Dyeing Process',
                        subheading: 'From nature to fabric, a journey of color and care.',
                        backgroundImage: mediaId,
                    },
                    processChain: processChain,
                    discoverMore: discoverMore,
                }
            })
            console.log('Created Process: my-process')
        } else {
            console.log('Process already exists. Updating with new schema...')
            await payload.update({
                collection: 'process-of-dyeing',
                id: existingProcess.docs[0].id,
                data: {
                    processChain: processChain,
                    discoverMore: discoverMore,
                    // sections: null // valid to unset? Payload might require null or just omit.
                }
            })
            console.log('Updated Process: my-process with new layout')
        }

        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

seed()
