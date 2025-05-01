/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove mdxRs which is no longer experimental in newer Next.js versions
  eslint: {
    dirs: ["."], // Specify the directories to lint
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
