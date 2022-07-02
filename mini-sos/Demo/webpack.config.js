const packageInfo = require('./package.json');
module.exports = {
  entry: {
    index: "./index.js"
  },
  output: {
    filename: "bundle.[name].js",
    libraryTarget: "amd",
    // 包名
    library: packageInfo.name,
  },
  externals: {
    antd: "antd"
  }
};
