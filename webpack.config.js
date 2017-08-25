const path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/client/index.js',
    'webpack-hot-middleware/client'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/, // include .js files
        enforce: 'pre', // preload the jshint loader
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        use: [
          {
            loader: 'jshint-loader'
          }
        ]
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'] // Applied from the right to the left (shortcut for full definition)
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader', // shortcut to rule.use
        options: { // options should be embeded in the rule
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
]
};