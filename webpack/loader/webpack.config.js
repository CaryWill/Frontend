const packageJson = require('./package.json');

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: `${__dirname}/build`,
    filename: '[name].js',
    libraryTarget: 'amd',
    library: packageJson.name,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: './index.js'
          }
        ],
      },
    ],
  },
};
