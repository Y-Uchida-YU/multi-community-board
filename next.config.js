/** @type {import('next').NextConfig} */
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
  