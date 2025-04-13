// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Wrap it with Reanimated's metro config
module.exports = wrapWithReanimatedMetroConfig(config);
