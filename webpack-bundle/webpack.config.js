module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    libraryTarget: "esm",
    // 包名
    library: "MyLibrary",
  },
};
