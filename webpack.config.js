const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: ['@babel/polyfill',process.env.NODE_ENV === 'publish'?'./src/dPlayer.js':'./src/index.js'],
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    // devtool: process.env.NODE_ENV === 'dev'?'inline-source-map':'none',
    devServer: {
        contentBase: './dist'
      },
    output: {
        filename: 'PlayerSDK.min.js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true
    }
};
