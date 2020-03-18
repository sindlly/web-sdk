const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: ['@babel/polyfill',process.env.NODE_ENV === 'dev'?'./src/index.js':'./src/dPlayer.js'],
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
        filename: 'PlayerSDK.min.js',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true
    }
};
