/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
  images: {
    remotePatterns: [
      // Para S3: { protocol: 'https', hostname: 'seu-bucket.s3.amazonaws.com' }
      // Para Cloudinary: { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
  },
};
module.exports = nextConfig;
