module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    libraryTarget: "amd",
    // 包名
    library: "MyLibrary",
  },
  externals: {
    //react: "react"
  }
};
