/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  // ESLint configuration with only valid options for Next.js 15.3.1
  eslint: {
    dirs: ['.'], // Directories to lint
    ignoreDuringBuilds: false,
  }
};

module.exports = nextConfig;
