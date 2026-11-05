const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': './src',
};

// Disable lazy loading for the entry point
config.serializer = {
  ...config.serializer,
  getModulesRunBeforeMainModule: () => [],
};

module.exports = config;