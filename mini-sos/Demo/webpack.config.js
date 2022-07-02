const packageInfo = require('./package.json');
module.exports = {
  entry: {
    index: "./index.js"
  },
  output: {
    filename: "bundle.[name].[hash].js",
    libraryTarget: "amd",
    // 包名
    library: packageInfo.name,
  },
  externals: {
    react: "react",
    "react-dom": "react-dom"
  }
};
