import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_IMAGE_HOSTS = new Set([
    'raw.githubusercontent.com',
    'github.com',
    'githubusercontent.com',
    'github-contributions-api.jogruber.de',
])

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 })
    }

    let target: URL
    try {
        target = new URL(url)
    } catch {
        return new NextResponse('Invalid url parameter', { status: 400 })
    }

    try {
        if (target.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.has(target.hostname)) {
            return new NextResponse('URL host is not allowed', { status: 400 })
        }

        const response = await fetch(target.toString(), { cache: 'no-store' })
        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status })
        }

        const contentType = response.headers.get('content-type')
        let content = await response.text()

        // SVG Manipulation: Make backgrounds transparent
        if (contentType?.includes('svg') || url.endsWith('.svg')) {
            // Replace background colors with 'none' (transparent)
            const colorReplacements = [
                /#0D1117/gi,  // Main background
                /#161B22/gi,  // Empty cells
                /rgb\(\s*13\s*,\s*17\s*,\s*23\s*\)/gi,
                /rgb\(\s*22\s*,\s*27\s*,\s*34\s*\)/gi,
                /#1b1f230a/gi,
            ]

            colorReplacements.forEach(pattern => {
                content = content.replace(pattern, 'none')
            })

            // Remove background rectangles
            content = content.replace(/<rect[^>]*class=['"]background['"][^>]*>/gi, '')
            content = content.replace(/<rect[^>]*id=['"]background['"][^>]*>/gi, '')
        }

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        console.error('Proxy error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
