const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-tools.js',
    library: 'MyTools',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  plugins: [new ESLintPlugin()],
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: {
        //   loader: 'babel-loader',
        // },
      },
    ],
  },
};
