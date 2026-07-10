/**
 * =============================================================================
 * CERTIFICATE ENRICHMENT SERVICE
 * =============================================================================
 * 
 * Main entry point for enriching certificates with metadata.
 * Detects platform and delegates to appropriate resolver.
 * =============================================================================
 */

import { BaseCertificate, EnrichedCertificateData, detectPlatform } from './types'
import { enrichFromCoursera } from './coursera'

/**
 * Enrich a certificate with metadata from its verification source
 * 
 * @param certificate - Base certificate data
 * @returns Enriched data or null if enrichment fails/unavailable
 */
export async function enrichCertificate(
    certificate: BaseCertificate
): Promise<EnrichedCertificateData | null> {
    const platform = detectPlatform(certificate.verifyUrl)

    switch (platform) {
        case 'coursera':
            return enrichFromCoursera(certificate.verifyUrl)

        // TODO: credly/aws/google resolvers not yet implemented
        case 'credly':
        case 'aws':
        case 'google':
        default:
            return null
    }
}

/**
 * Enrich multiple certificates in parallel
 * 
 * @param certificates - Array of base certificates
 * @returns Map of certificate ID to enriched data
 */
export async function enrichCertificates(
    certificates: BaseCertificate[]
): Promise<Record<string, EnrichedCertificateData>> {
    const results: Record<string, EnrichedCertificateData> = {}

    // Process in parallel with concurrency limit
    const CONCURRENCY = 3
    const chunks: BaseCertificate[][] = []

    for (let i = 0; i < certificates.length; i += CONCURRENCY) {
        chunks.push(certificates.slice(i, i + CONCURRENCY))
    }

    for (const chunk of chunks) {
        const enrichments = await Promise.all(
            chunk.map(async (cert) => {
                const enriched = await enrichCertificate(cert)
                return { id: cert.id, enriched }
            })
        )

        for (const { id, enriched } of enrichments) {
            if (enriched) {
                results[id] = enriched
            }
        }

        // Rate limiting delay between chunks
        if (chunks.indexOf(chunk) < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    return results
}
