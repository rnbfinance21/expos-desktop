const path = require('path');
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@components': path.resolve(__dirname, 'components'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@services': path.resolve(__dirname, 'services'),
      '@features': path.resolve(__dirname, 'features'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@modules': path.resolve(__dirname, 'modules'),
      '@config': path.resolve(__dirname, 'config'),
    };
    return config;
  },
  images: {
    domains: ["192.168.1.8"],
    unoptimized: true,
    remotePatterns: [
      {
        // protocol: "https",
        hostname: "**",
      },
    ],
  },
};
