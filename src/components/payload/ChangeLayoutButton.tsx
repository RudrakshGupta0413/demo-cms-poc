'use client'

import React from 'react'
import { useField, Button } from '@payloadcms/ui'
import './ChangeLayoutButton.css'

export default function ChangeLayoutButton() {
    const { value, setValue } = useField<string>({ path: 'layoutType' })

    if (!value) return null

    return (
        <div className="change-layout-container">
            <div className="change-layout-info">
                <span className="change-layout-label">Current Layout: </span>
                <span className="change-layout-value">{value} Layout</span>
            </div>
            <div className="change-layout-action">
                <Button
                    buttonStyle="secondary"
                    size="small"
                    onClick={() => {
                        if (window.confirm('Are you sure? Changing layout will hide layout-specific content until you choose again.')) {
                            setValue(null)
                        }
                    }}
                >
                    Change Layout
                </Button>
            </div>
        </div>
    )
}
