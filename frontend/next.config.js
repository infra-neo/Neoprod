/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ZITADEL_DOMAIN: process.env.NEXT_PUBLIC_ZITADEL_DOMAIN,
    NEXT_PUBLIC_POMERIUM_DOMAIN: process.env.NEXT_PUBLIC_POMERIUM_DOMAIN,
    NEXT_PUBLIC_NETBIRD_API: process.env.NEXT_PUBLIC_NETBIRD_API,
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
