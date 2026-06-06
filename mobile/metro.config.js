const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const originalEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware(middleware, server) {
    const enhancedMiddleware =
      originalEnhanceMiddleware?.(middleware, server) ?? middleware;

    return (req, res, next) => {
      if (req.url?.includes("unstable_transformProfile=hermes-stable")) {
        req.url = req.url.replace(
          "unstable_transformProfile=hermes-stable",
          "unstable_transformProfile=default"
        );
      }

      return enhancedMiddleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, {
  input: "./global.css",
});
