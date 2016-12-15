var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'docs');

module.exports = {
    context: APP_PATH,
    entry: [
        "babel-polyfill",
        "./index.js"
    ],
    output: {
        path: BUILD_PATH,
        publicPath: process.env.NODE_ENV === 'production' ? "" : "http://localhost:8080/",
        filename: "bundle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./index.ejs"
    })]
};