const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './src/dPlayer.js',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
      },
    output: {
        filename: 'playerSDK.min.js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    }
};
