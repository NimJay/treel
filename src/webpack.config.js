const path = require('path');

module.exports = {
	entry: './front/Treel.jsx',
	output: {
		path: path.resolve(__dirname, 'public/js/'),
		filename: 'treel.js',
		publicPath: '/public/js/'
    },
	watch: true,
	module: {
	  loaders: [
		{
		  test: /\.jsx?$/,
		  exclude: /node_modules/,
		  loader: 'babel-loader',
		  options: {
          	presets: [['es2015', {modules: false}], ['react']]
    	  }
		}
	  ]
	}
};
