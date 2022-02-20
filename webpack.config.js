const path = require('path');


module.exports = {
  	entry: './src/index.tsx',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader:  'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'],
				},
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js',  '.jsx'],
	},
	plugins: [
	
	],
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'build'),
	},
	devServer: {
		static: path.resolve(__dirname, 'build'),
		compress: true,
		port: 3000,
	},
	
};