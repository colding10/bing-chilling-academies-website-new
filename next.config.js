/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  eslint: {
    dirs: ["."], // Specify the directories to lint
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
