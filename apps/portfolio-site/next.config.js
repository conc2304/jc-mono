//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  transpilePackages: ['@jc/ui-components', '@jc/theme'],
};

const withVanillaExtract = createVanillaExtractPlugin();

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
];

module.exports = composePlugins(...plugins)(nextConfig);
