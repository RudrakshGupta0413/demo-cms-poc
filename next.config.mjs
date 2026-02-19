/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@payloadcms/next', '@payloadcms/richtext-lexical', '@payloadcms/ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
