/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer"

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
    config.plugins
      .push
      // Any additional plugins would go here
      ()

    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: "@mdx-js/loader",
          options: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        },
      ],
    })

    return config
  },
}

// Enable bundle analyzer in production build
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withBundleAnalyzerConfig(nextConfig)
