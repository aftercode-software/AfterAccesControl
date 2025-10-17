const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.symbolicator = {
  customizeFrame: (frame) => {
    const f = frame.file || "";
    if (f.includes("InternalBytecode.js")) {
      return { ...frame, collapse: true };
    }
    return frame;
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
