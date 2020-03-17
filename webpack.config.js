const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: ['@babel/polyfill','./src/dPlayer.js'],
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    devtool: 'none',
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
