const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // CRA puts loaders inside `oneOf`; rules on `module.rules` alone won't run first.
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      const rawHtmlRule = {
        test: /\.html$/i,
        resourceQuery: /raw/,
        type: "asset/source",
      };
      if (oneOfRule && Array.isArray(oneOfRule.oneOf)) {
        oneOfRule.oneOf.unshift(rawHtmlRule);
      } else {
        webpackConfig.module.rules.unshift(rawHtmlRule);
      }
      return webpackConfig;
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@api": path.resolve(__dirname, "src/api"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@common": path.resolve(__dirname, "src/common"),
      "@components": path.resolve(__dirname, "src/components"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@providers": path.resolve(__dirname, "src/providers"),
      "@router": path.resolve(__dirname, "src/router"),
      "@socket": path.resolve(__dirname, "src/socket"),
    },
  },
};
