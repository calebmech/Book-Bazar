/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/swagger",
          destination: "/api/swagger/index.html",
        },
      ],
    };
  },
};
