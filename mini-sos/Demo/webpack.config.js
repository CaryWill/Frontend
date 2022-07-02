const packageInfo = require('./package.json');
module.exports = {
  entry: {
    index: "./index.js",
    input: "./input.js"
  },
  output: {
    filename: "[name].js",
    libraryTarget: "amd",
    // 包名
    library: packageInfo.name,
  },
  externals: {
    antd: "antd"
  }
};
