/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // Stub optional connector dependency that causes build resolution errors
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['porto/internal'] = false;
    config.resolve.alias['@base-org/account'] = false;
    config.resolve.alias['@gemini-wallet/core'] = false;
    config.resolve.alias['@metamask/sdk'] = false;
    config.resolve.alias['porto'] = false;
    config.resolve.alias['@safe-global/safe-apps-provider'] = false;
    config.resolve.alias['@safe-global/safe-apps-sdk'] = false;
    return config;
  },
}

module.exports = nextConfig
