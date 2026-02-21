const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/app.js',
  mode:'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: '.dist',
    compress: true,
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./index.html"
  }),
  new CopyPlugin({
    patterns: [
      { from: "src/templates", to: "src/templates" },
      { from: "src/css", to: "src/css" },
      { from: "assets/images", to: "assets/images" },
    ],
  }),
  ],
};