/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // すべてのページに適用
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://pagead2.googlesyndication.com 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://pagead2.googlesyndication.com",
              "connect-src 'self'",
            ].join('; ')
          }
        ]
      }
    ]
  },
}
module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/01-choice-prefectures',
          permanent: true,
        },
      ];
    },
  };
  