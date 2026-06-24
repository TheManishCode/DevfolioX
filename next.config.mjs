/** @type {import('next').NextConfig} */

// Security Headers Configuration
// CSP uses unsafe-inline/unsafe-eval which Next.js requires for proper functionality
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      // img-src: specific CDNs for images
      "img-src 'self' data: blob: https://cdn.myanimelist.net https://s4.anilist.co https://cdn.cloudflare.steamstatic.com https://images.alphacoders.com https://images6.alphacoders.com https://images.igdb.com https://cdn2.steamgriddb.com https://upload.wikimedia.org https://cdn2.unrealengine.com https://media.rawg.io https://avatars.githubusercontent.com https://i.scdn.co https://store.steampowered.com https://readme-typing-svg.demolab.com https://raw.githubusercontent.com https://github-profile-summary-cards.vercel.app https://github-readme-stats.vercel.app https://komarev.com https://skillicons.dev https://projectpokemon.org https://img.icons8.com",
      // media-src: audio and video files
      "media-src 'self' https://play.pokemonshowdown.com",
      // frame-src: allow youtube embeds
      "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
      // connect-src: APIs used by the site + Vercel Analytics
      "connect-src 'self' https://api.github.com https://api.wakatime.com https://api.myanimelist.net https://api.spotify.com https://accounts.spotify.com https://alfa-leetcode-api.onrender.com https://www.duolingo.com https://api.steampowered.com https://store.steampowered.com https://api.linkedin.com https://www.linkedin.com https://discord.com https://api.weatherapi.com https://github-contributions-api.jogruber.de https://vitals.vercel-insights.com https://va.vercel-scripts.com wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    // Allow external images from anime/game CDNs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 'images.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images6.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.steamgriddb.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.unrealengine.com',
      },
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
      // GitHub README images
      {
        protocol: 'https',
        hostname: 'readme-typing-svg.demolab.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github-profile-summary-cards.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-stats.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'komarev.com',
      },
      {
        protocol: 'https',
        hostname: 'skillicons.dev',
      },
      {
        protocol: 'https',
        hostname: 'projectpokemon.org',
      },
    ],
  },
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
