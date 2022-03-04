const fs = require('fs');
const path = require('path');
const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin=require('speed-measure-webpack-plugin')
let publicPath = '//home.mangoya.cn/Aimee/DEMO/h5-federation/';

let config = merge(common,{
  mode: 'production',

output: {
    publicPath,
    path:path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:5].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
    ],
  },
  optimization: {
    minimize: true,
    splitChunks:{
      chunks: 'all',
      cacheGroups:{
        antd: {
          name: 'antd-federation',
          test: (module) => {
            return /ant/.test(module.context)
          },
          priority: 2,
          enforce: true
        },
        lodash: {
          name: 'lodash-federation',
          test: (module) => {
            return /lodash/.test(module.context)
          },
          priority: 2,
          enforce: true
        },
        moment: {
          name: 'moment-federation',
          test: (module) => {
            return /moment/.test(module.context)
          },
          priority: 2,
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin(),
    new SpeedMeasurePlugin(),
    new FriendlyErrorsWebpackPlugin({
      // 是否每次都清空控制台
      clearConsole: true,
    })
  ]
})
module.exports = config
