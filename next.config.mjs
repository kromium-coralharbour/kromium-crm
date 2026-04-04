/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  images: {
    domains: ['rjnktjapcrzlruulpoik.supabase.co'],
  },
}

export default nextConfig
