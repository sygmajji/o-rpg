var path = require('path')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var WriteFilePlugin = require('write-file-webpack-plugin')

// process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  entry: {
    app: [
      // 'webpack-hot-middleware/client',
      './src/client/client.js'
    ]
  },
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: '[name]-bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      request: 'browser-request'
    }
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            compact: true,
            presets: [
                ['env']
            ]
        }
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'] // Applied from the right to the left (shortcut for full definition)
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    // Always provide plugins
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // Force writing files on disk and not on memory
    new WriteFilePlugin(),
    // Copy assets files from source to dist folder
    new CopyWebpackPlugin([{
                context: projectRoot,
                from: 'src/assets',
                to: 'assets/',
            }
        ]
    ),
  ]
};