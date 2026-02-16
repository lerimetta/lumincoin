const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "source", to: "dest" },
        { from: "other", to: "public" },
      ],
    }),
  ],
};
module.exports = {
  entry: './src/app.js',
  mode:'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
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