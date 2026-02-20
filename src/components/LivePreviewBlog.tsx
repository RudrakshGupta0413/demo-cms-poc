'use client'

import React from 'react'
import Image from 'next/image'
import { Editable } from '@/components/Editable'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import '../styles/LivePreviewBlog.css'

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN ?? 'http://localhost:3005'

export function LivePreviewBlog({ initialPage }: any) {
    const { data } = useLivePreview({
        initialData: initialPage,
        serverURL: ADMIN_ORIGIN,
        depth: 3,
    })

    console.log('LivePreviewBlog Debug:', { initialPage, data })

    let { hero, section1, section2, section3, section4 } = data || {}

    // Fallback for hero image if it's missing URL (unpopulated ID)
    if (hero?.backgroundImage && !hero.backgroundImage.url) {
        const initialImage = initialPage?.hero?.backgroundImage
        if (initialImage?.id && (hero.backgroundImage === initialImage.id || hero.backgroundImage?.id === initialImage.id)) {
            hero = {
                ...hero,
                backgroundImage: initialImage,
            }
        }
    }

    const sections = [
        { data: section1, path: 'section1' },
        { data: section2, path: 'section2' },
        { data: section3, path: 'section3' },
        { data: section4, path: 'section4' },
    ].map((s) => {
        // preserve image if it lacks URL (unpopulated ID)
        if (s.data?.image && !s.data.image.url) {
            const initialSection = initialPage?.[s.path]
            const initialImage = initialSection?.image
            // Check if IDs match (loose equality for string/number)
            if (initialImage?.id && (s.data.image === initialImage.id || s.data.image?.id === initialImage.id)) {
                return {
                    ...s,
                    data: {
                        ...s.data,
                        image: initialImage,
                    },
                }
            }
        }
        return s
    }).filter(s => !!s.data?.image)

    return (
        <main className="blog-main">
            {/* HERO SECTION */}
            <section className="blog-hero">
                {hero?.backgroundImage?.url && (
                    <div className="blog-hero-image-container">
                        <Image
                            src={hero.backgroundImage.url}
                            alt={hero.backgroundImage.alt || 'Hero'}
                            fill
                            className="blog-hero-image"
                            priority
                        />
                    </div>
                )}
            </section>

            {/* CONTENT SECTIONS */}
            <div className="blog-container">
                {sections.map((sectionObj: any, index: number) => {
                    const section = sectionObj.data
                    const fieldPath = sectionObj.path
                    const isEven = index % 2 === 1

                    return (
                        <section key={index} className={`blog-section ${isEven ? 'blog-section-reverse' : ''}`}>
                            <div className="blog-section-content">
                                {/* IMAGE FIRST in source order */}
                                <div className="blog-section-image-wrapper">
                                    <Editable
                                        collectionSlug="pages"
                                        docID={String(data.id)}
                                        fieldPath={`${fieldPath}.image`}
                                        adminOrigin={ADMIN_ORIGIN}
                                    >
                                        {section.image?.url ? (
                                            <Image
                                                src={section.image.url}
                                                alt={section.image.alt || 'Section Image'}
                                                fill
                                                className="blog-section-image"
                                            />
                                        ) : (
                                            <div className="blog-image-placeholder">No Image</div>
                                        )}
                                    </Editable>
                                </div>

                                {/* TEXT SECOND in source order */}
                                <div className="blog-section-text-wrapper">
                                    {section.heading && (
                                        <h2 className="blog-section-heading">
                                            <Editable
                                                collectionSlug="pages"
                                                docID={String(data.id)}
                                                fieldPath={`${fieldPath}.heading`}
                                                adminOrigin={ADMIN_ORIGIN}
                                                tagName="span"
                                            >
                                                {section.heading}
                                            </Editable>
                                        </h2>
                                    )}
                                    <div className="blog-section-text">
                                        <Editable
                                            collectionSlug="pages"
                                            docID={String(data.id)}
                                            fieldPath={`${fieldPath}.content`}
                                            adminOrigin={ADMIN_ORIGIN}
                                        >
                                            <RichText data={section.content} />
                                        </Editable>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })}
            </div>
        </main>
    )
}
