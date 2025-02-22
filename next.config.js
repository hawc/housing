/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const process = require('process');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pathBuilder = (subpath) => path.join(process.cwd(), subpath);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: true,
  swcMinify: true,

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
    ];
  },
  // SVGR
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/Workers'),
            to: '../public/cesium/Workers',
            info: { minimized: true }
          }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/ThirdParty'),
            to: '../public/cesium/ThirdParty',
            info: { minimized: true }
          }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/Assets'),
            to: '../public/cesium/Assets',
            info: { minimized: true }
          }
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pathBuilder('node_modules/cesium/Build/Cesium/Widgets'),
            to: '../public/cesium/Widgets',
            info: { minimized: true }
          }
        ]
      }),
      new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify('/cesium') })
    );

    return config;
  },
};

module.exports = nextConfig;
