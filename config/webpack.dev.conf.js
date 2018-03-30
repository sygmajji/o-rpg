// const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const merge = require('webpack-merge')
// const config = require('./usagi.conf')
// const webpack = require('webpack')

let webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    plugins: [
    ]
})

module.exports = webpackConfig