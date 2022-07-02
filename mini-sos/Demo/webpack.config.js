const packageInfo = require('./package.json');
module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    libraryTarget: "amd",
    // 包名
    library: packageInfo.name,
  },
  externals: {
    //react: "react"
  }
};
