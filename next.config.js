/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'raw.githubusercontent.com', 'via.placeholder.com']
  }
};

module.exports = nextConfig;
