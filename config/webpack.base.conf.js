const path = require('path')
const webpack = require('webpack')
const projectRoot = path.resolve(__dirname, '../')
const distFolder =  path.resolve(projectRoot, 'dist')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// process.env.NODE_ENV = process.env.NODE_ENV || "development";


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  entry: {
    app: [
      // 'webpack-hot-middleware/client',
      './src/client/client.js'
    ]
  },
  output: {
    path: distFolder,
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
    extensions: ['.js', '.vue', '.json'],
    alias: {
      request: 'browser-request',
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']          }
        }
      },
      {
        test: /.css$/,
        use: ['vue-style-loader', 'style-loader', 'css-loader'] // Applied from the right to the left (shortcut for full definition)
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
    new VueLoaderPlugin(),
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