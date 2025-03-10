module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

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
