var path = require('path')
var webpack = require('webpack')

process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src/client/client.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: '#eval-source-map',
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
]
};