'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export function FormBuilder({ form }: { form: any }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [errors, setErrors] = useState<any>({})
    const router = useRouter()

    if (!form) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus('loading')

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        // Format for Payload form-builder
        const submission = form.fields.map((field: any) => ({
            field: field.name,
            value: data[field.name],
        }))

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3010'}/api/form-submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    form: form.id,
                    submissionData: submission,
                }),
            })

            if (res.ok) {
                router.push('/form-success')
            } else {
                setStatus('error')
            }
        } catch (err) {
            setStatus('error')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{form.title}</h2>
            {form.fields.map((field: any) => (
                <div key={field.name} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        {field.label}
                        {field.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
                    </label>
                    {field.blockType === 'text' && (
                        <input
                            type="text"
                            name={field.name}
                            required={field.required}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem'
                            }}
                        />
                    )}
                    {field.blockType === 'email' && (
                        <input
                            type="email"
                            name={field.name}
                            required={field.required}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem'
                            }}
                        />
                    )}
                    {field.blockType === 'textarea' && (
                        <textarea
                            name={field.name}
                            required={field.required}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '0.375rem'
                            }}
                        />
                    )}
                </div>
            ))}
            <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: status === 'loading' ? '#94a3b8' : '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: 'bold',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                }}
            >
                {status === 'loading' ? 'Submitting...' : form.submitButtonLabel || 'Submit'}
            </button>
            {status === 'error' && (
                <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
                    Something went wrong. Please try again.
                </p>
            )}
        </form>
    )
}
