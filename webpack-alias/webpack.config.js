const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: `${__dirname}/build`,
    filename: "[name].js",
    libraryTarget: "umd",
    library: "test",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
};
