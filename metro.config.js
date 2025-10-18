// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Ignore watching gradle plugin folders
config.watchFolders = config.watchFolders.filter(
  folder => !folder.includes("@react-native/gradle-plugin")
);

// Wrap it with Reanimated's metro config
module.exports = wrapWithReanimatedMetroConfig(config);
