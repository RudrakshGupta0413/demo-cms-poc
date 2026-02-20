'use client'

import React from 'react'
import Image from 'next/image'
import { Editable } from '@/components/Editable'
import { useLivePreview } from '@payloadcms/live-preview-react'
import '../styles/LivePreviewProcessOfDyeing.css'

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_PAYLOAD_ADMIN_ORIGIN ?? 'http://localhost:3005'

export function LivePreviewProcessOfDyeing({ initialPage }: any) {
    const { data } = useLivePreview({
        initialData: initialPage,
        serverURL: ADMIN_ORIGIN,
        depth: 3,
    })

    console.log('LivePreviewProcess Debug:', { initialPage, data })

    let { hero, step1, step2, step3, step4, discoverMore } = data || {}

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
    const steps = [
        { data: step1, path: 'step1' },
        { data: step2, path: 'step2' },
        { data: step3, path: 'step3' },
        { data: step4, path: 'step4' },
    ].map((s) => {
        // preserve image if it lacks URL (unpopulated ID)
        if (s.data?.image && !s.data.image.url) {
            const initialStep = initialPage?.[s.path]
            const initialImage = initialStep?.image
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

    const discoverItems = [
        { data: discoverMore?.item1, path: 'discoverMore.item1' },
        { data: discoverMore?.item2, path: 'discoverMore.item2' },
        { data: discoverMore?.item3, path: 'discoverMore.item3' },
    ].map((i) => {
        // preserve image if it lacks URL (unpopulated ID)
        if (i.data?.image && !i.data.image.url) {
            const initialItem = initialPage?.discoverMore?.[i.path.split('.')[1]] // e.g. item1
            const initialImage = initialItem?.image
            // Check if IDs match (loose equality for string/number)
            if (initialImage?.id && (i.data.image === initialImage.id || i.data.image?.id === initialImage.id)) {
                return {
                    ...i,
                    data: {
                        ...i.data,
                        image: initialImage,
                    },
                }
            }
        }
        return i
    }).filter(i => !!i.data?.image)

    return (
        <main className="process-main">
            {/* HERO SECTION */}
            <section className="process-hero">
                {hero?.backgroundImage?.url && (
                    <div className="process-hero-bg-container">
                        <Image
                            src={hero.backgroundImage.url}
                            alt={hero.backgroundImage.alt || 'Hero'}
                            fill
                            className="process-hero-bg-image"
                            priority
                        />
                    </div>
                )}
                <div className="process-hero-overlay" />

                <div className="process-hero-content">
                    <h1 className="process-hero-title">
                        <Editable
                            collectionSlug="pages"
                            docID={String(data.id)}
                            fieldPath="hero.heading"
                            adminOrigin={ADMIN_ORIGIN}
                            tagName="span"
                        >
                            {hero?.heading || 'Process of Dyeing'}
                        </Editable>
                    </h1>
                    {hero?.subheading && (
                        <p className="process-hero-subtitle">
                            <Editable
                                collectionSlug="pages"
                                docID={String(data.id)}
                                fieldPath="hero.subheading"
                                adminOrigin={ADMIN_ORIGIN}
                                tagName="span"
                            >
                                {hero?.subheading}
                            </Editable>
                        </p>
                    )}
                </div>
            </section>

            {/* PROCESS CHAIN */}
            <div className="process-chain-container">
                {steps.map((stepObj: any, index: number) => {
                    const step = stepObj.data
                    const fieldPath = stepObj.path
                    return (
                        <div key={index} className="process-step">
                            <div className="process-step-content">
                                <h2 className="process-step-heading">
                                    <Editable
                                        collectionSlug="pages"
                                        docID={String(data.id)}
                                        fieldPath={`${fieldPath}.heading`}
                                        adminOrigin={ADMIN_ORIGIN}
                                        tagName="span"
                                    >
                                        {step.heading}
                                    </Editable>
                                </h2>
                                <p className="process-step-description">
                                    <Editable
                                        collectionSlug="pages"
                                        docID={String(data.id)}
                                        fieldPath={`${fieldPath}.description`}
                                        adminOrigin={ADMIN_ORIGIN}
                                        tagName="span"
                                    >
                                        {step.description}
                                    </Editable>
                                </p>
                            </div>
                            <div className="process-step-image-wrapper">
                                <Editable
                                    collectionSlug="pages"
                                    docID={String(data.id)}
                                    fieldPath={`${fieldPath}.image`}
                                    adminOrigin={ADMIN_ORIGIN}
                                >
                                    {step.image?.url ? (
                                        <Image
                                            src={step.image.url}
                                            alt={step.image.alt || 'Process Image'}
                                            fill
                                            className="process-step-image"
                                        />
                                    ) : (
                                        <div className="process-step-placeholder">No Image</div>
                                    )}
                                </Editable>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* DISCOVER MORE */}
            {discoverMore && (
                <section className="process-discover">
                    <h2 className="process-discover-heading">
                        <Editable
                            collectionSlug="pages"
                            docID={String(data.id)}
                            fieldPath="discoverMore.heading"
                            adminOrigin={ADMIN_ORIGIN}
                            tagName="span"
                        >
                            {discoverMore.heading || 'Discover more'}
                        </Editable>
                    </h2>
                    <div className="process-discover-grid">
                        {discoverItems.map((itemObj: any, index: number) => {
                            const item = itemObj.data
                            const fieldPath = itemObj.path
                            return (
                                <div key={index} className="process-discover-item">
                                    <div className="process-discover-item-image-wrapper">
                                        <Editable
                                            collectionSlug="pages"
                                            docID={String(data.id)}
                                            fieldPath={`${fieldPath}.image`}
                                            adminOrigin={ADMIN_ORIGIN}
                                        >
                                            {item.image?.url ? (
                                                <Image
                                                    src={item.image.url}
                                                    alt={item.image.alt || 'Discover Item'}
                                                    fill
                                                    className="process-discover-item-image"
                                                />
                                            ) : (
                                                <div className="process-item-placeholder">No Image</div>
                                            )}
                                        </Editable>
                                    </div>
                                    <h3 className="process-discover-item-title">
                                        <Editable
                                            collectionSlug="pages"
                                            docID={String(data.id)}
                                            fieldPath={`${fieldPath}.heading`}
                                            adminOrigin={ADMIN_ORIGIN}
                                            tagName="span"
                                        >
                                            {item.heading}
                                        </Editable>
                                    </h3>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}
        </main>
    )
}
