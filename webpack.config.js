var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: ['whatwg-fetch', './src/main.js'],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'stats-lite-query.bundle.js'
	},
	devtool: 'inline-source-map',
	module: {
		loaders: [
			{
				test: path.join(__dirname, 'src'),
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};
