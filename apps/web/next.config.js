/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hovawart-db/shared', '@hovawart-db/ui'],
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },
}

module.exports = nextConfig
