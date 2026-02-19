'use client'

import React from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import './LayoutSelector.css'

const LayoutSelector: React.FC<{ path: string; label: string }> = ({ path, label }) => {
    const { value, setValue } = useField<string>({ path })

    const options = [
        {
            value: 'blog',
            label: 'Blog Layout',
            description: 'Editorial style with alternating image and text sections. Perfect for stories.',
            preview: (
                <div className="mini-layout-blog">
                    <div className="mini-hero"></div>
                    <div className="mini-row">
                        <div className="mini-img"></div>
                        <div className="mini-text">
                            <div className="mini-line"></div>
                            <div className="mini-line"></div>
                            <div className="mini-line short"></div>
                        </div>
                    </div>
                    <div className="mini-row reverse">
                        <div className="mini-img"></div>
                        <div className="mini-text">
                            <div className="mini-line"></div>
                            <div className="mini-line"></div>
                            <div className="mini-line short"></div>
                        </div>
                    </div>
                    <div className="mini-row">
                        <div className="mini-img"></div>
                        <div className="mini-text">
                            <div className="mini-line"></div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            value: 'process',
            label: 'Process Layout',
            description: 'Immersive full-screen hero followed by sequential steps and discovery grid.',
            preview: (
                <div className="mini-layout-process">
                    <div className="mini-process-hero"></div>
                    <div className="mini-step">
                        <div className="mini-line short" style={{ width: '40%' }}></div>
                        <div className="mini-step-box"></div>
                    </div>
                    <div className="mini-step">
                        <div className="mini-step-box"></div>
                    </div>
                    <div className="mini-grid">
                        <div className="mini-grid-item"></div>
                        <div className="mini-grid-item"></div>
                        <div className="mini-grid-item"></div>
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div className="layout-selector-wrapper">
            <div className="layout-selector-header">
                <h2>Step 1: Choose Your Page Layout</h2>
                <p>Select a template to begin building your page. You can change this later.</p>
            </div>
            <div className="layout-cards">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`layout-card ${value === option.value ? 'active' : ''}`}
                        onClick={() => setValue(option.value)}
                    >
                        <div className="layout-card-preview">{option.preview}</div>
                        <div className="layout-card-content">
                            <h3 className="layout-card-label">{option.label}</h3>
                            <p className="layout-card-description">{option.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LayoutSelector
