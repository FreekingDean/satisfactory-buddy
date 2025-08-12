const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "stream": require.resolve("stream-browserify")
      };
      
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "stream/web": path.resolve(__dirname, "src/stream/web.js")
      };
      
      return webpackConfig;
    }
  }
};