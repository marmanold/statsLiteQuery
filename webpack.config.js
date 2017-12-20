var path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");
var webpack = require('webpack');

module.exports = {
	entry: {
		'marcom-stats-query':['babel-polyfill', './src/main.js'], 
		'lectserve-stats-query':['babel-polyfill', './src/main.js'], 
		'stats-lite-query':['babel-polyfill', './src/main.js']
	}, 
	module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    babelrc: true,
                    compact: true, 
                    plugins: ['transform-runtime']
                }
            }
        }]
    },
    output: {
        filename: '[name].bundle.js', 
        path: path.resolve(__dirname,'build')
    },
    plugins: [
        new MinifyPlugin({removeConsole:true},{comments:false})
    ],
    target: 'web'
};
