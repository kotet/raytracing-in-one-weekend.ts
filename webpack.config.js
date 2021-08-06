const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: `${outputPath}`
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules|\.d\.ts/
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader,'css-loader'],
        exclude: '/node-modules/'
      }
    ]
  },
  resolve: {
    extensions: ['.js','.ts','.css']
  },
  devServer: {
    contentBase: `${outputPath}/`,
    hot: true,
    watchContentBase: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Raytracer'
    }),
    new MiniCssExtractPlugin(),
  ]
};