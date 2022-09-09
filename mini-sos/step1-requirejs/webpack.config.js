module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    libraryTarget: 'amd',
    library: 'MyLibrary'
  },
};
