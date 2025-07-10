/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: true,
  turbopack: {
    rules: {
      '*.svg': {
        as: '*.js',
        loaders: ['@svgr/webpack'],
      },
    },
  },
  images: {
    domains: [
      'res.cloudinary.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/siedlungen/weisse-siedlung-an-der-aronstrasse',
        destination: '/siedlungen/weisse-siedlung',
        permanent: true,
      },
      {
        source: '/siedlungen/sachsendorfmadlow',
        destination: '/siedlungen/sachsendorf-madlow',
        permanent: true,
      },
      {
        source: '/siedlungen/gro%C3%9Fer-dreesch',
        destination: '/siedlungen/grosser-dreesch',
        permanent: true,
      },
      {
        source: '/siedlungen/großer-dreesch',
        destination: '/siedlungen/grosser-dreesch',
        permanent: true,
      },
      {
        source: '/siedlungen/paunsdorf',
        destination: '/siedlungen/neu-paunsdorf',
        permanent: true,
      },
      {
        source: '/siedlungen/wk-i-v-zentrum-neue-zeit',
        destination: '/siedlungen/wk-iv-v-neue-zeit',
        permanent: true,
      },
      {
        source: '/architekten/helmut-von-wetz',
        destination: '/architekten/helmut-von-werz',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
