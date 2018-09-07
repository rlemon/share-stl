const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
	template: './src/client/index.html',
	filename: './index.html'
})

module.exports = {
	mode: 'development', 
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader', 
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.stl$/,
				use: [
					{
						loader: 'file-loader', 
						options: {
							name: 'assets/[hash].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		htmlPlugin
	],
	output: {
		publicPath: '/'
	},
	devtool: 'source-map'
};