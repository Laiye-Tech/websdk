/**
 * @file local compile
 */

const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const version = require('./package.json').version
const isProd = process.env.NODE_ENV === 'production'

const clientConfig = {
  mode: process.env.NODE_ENV,
  devtool: 'none',

  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false
        }
      })
    ]
  },

  entry: {
    IMLib: './client/index.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name]-${version}.min.js`,
    library: 'websdk',
    libraryTarget: 'var',
    libraryExport: 'default'
  },

  node: {
    fs: 'empty'
  },

  module: {
    rules: [{
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]_[hash:base64:5]'
            }
          },
          'less-loader'
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: './index.html',
      hash: true
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.MODE': JSON.stringify(process.env.MODE)
    })
  ],

  devServer: {
    host: '0.0.0.0',
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://172.17.227.171',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      // '/openapi': {
      //   target: 'http://testopenapi.laiye.com',
      //   changeOrigin: true,
      //   pathRewrite: { '^/openapi': '' }
      // }
    }
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx']
  },

  externals: {
    RongIMLib: 'RongIMLib'
  }
}

const serverConfig = {
  target: 'node',
  mode: 'development',
  devtool: 'none',

  optimization: {
    minimize: false
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  entry: {
    server: './server/index.ts'
  },

  node: {
    __filename: false,
    __dirname: false
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.SDK_VERSION': JSON.stringify(version),
      'process.env.MODE': JSON.stringify(process.env.MODE)
    })
  ]
}

module.exports = [clientConfig, serverConfig]
