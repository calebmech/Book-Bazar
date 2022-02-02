/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'book-bazar-images.s3.us-east-2.amazonaws.com',
      'campusstore.mcmaster.ca',
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/swagger",
          destination: "/swagger",
        },
      ],
    };
  },
};
