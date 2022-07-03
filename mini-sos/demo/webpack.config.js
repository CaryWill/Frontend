const packageInfo = require("./package.json");
module.exports = {
  entry: {
    index: "./index.js",
  },
  output: {
    //filename: "bundle.[name].[hash].js",
    filename: "bundle.[name].js",
    libraryTarget: "amd",
    // 包名
    library: packageInfo.name,
  },
  externals: {
    moment: "moment",
  },
  devServer: {
    static: "./dist",
  },
  module: {
    loaders: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
};
