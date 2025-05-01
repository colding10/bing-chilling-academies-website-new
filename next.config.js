/** @type {import('next').NextConfig} */

const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? // Using dynamic import instead of require for TypeScript linting compliance
    ((mod) => mod.default || mod)(require('next-bundle-analyzer'))()
  : (config) => config

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  eslint: {
    dirs: ["."],
    ignoreDuringBuilds: false,
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    // Plugin configuration
    config.plugins.push(
      // Any additional plugins would go here
    )
    
    return config
  },
}

// Export the config with bundle analyzer if enabled
export default withBundleAnalyzer(nextConfig)
