var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		'marcom-stats-query':['./src/main.js'],
		'lectserve-stats-query':['./src/main.js'],
		'stats-lite-query':['./src/main.js']
	},
	module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    babelrc: true,
                    minified: true
                }
            }
        }]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'build')
    },
    target: 'web',
    mode: 'production'
};
