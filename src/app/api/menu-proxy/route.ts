import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { endpoint, ...data } = body

        // Default to /opn if no endpoint specified (for backward compatibility)
        const targetPath = endpoint ? endpoint : '/opn'
        const url = `http://localhost:4000${targetPath}`

        console.log(`Proxying request to: ${url}`)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('API Proxy Error:', errorData)
            // Attempt to parse JSON error if possible
            try {
                const parsedError = JSON.parse(errorData)
                return NextResponse.json({
                    error: 'External API Error',
                    details: parsedError,
                    status: response.status
                }, { status: 200 }) // Return 200 so frontend can show the message
            } catch {
                return NextResponse.json({
                    error: 'External API Error',
                    message: errorData,
                    status: response.status
                }, { status: 200 })
            }
        }

        const responseData = await response.json()

        if (responseData === null) {
            console.error('API returned null response')
            return NextResponse.json({
                STATUS_MESSAGE: 'Backend returned an empty/null response.',
                STATUS_CODE: 'MIS-ERR-NULL',
                DATA: null
            }, { status: 200 })
        }

        return NextResponse.json(responseData)
    } catch (error) {
        console.error('API Proxy Exception:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
