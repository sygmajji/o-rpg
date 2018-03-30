const path = require('path')
const webpack = require('webpack')
const projectRoot = path.resolve(__dirname, '../')
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          name: "vendors",
          enforce: true
        }
      }
    }
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
    // Copy assets files from source to dist folder
    new CopyWebpackPlugin([
      {
        context: projectRoot,
        from: 'src/assets',
        to: 'assets/',
      }]
    ),
  ]
};