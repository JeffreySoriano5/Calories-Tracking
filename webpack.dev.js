const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

const cachePath = path.resolve(__dirname, '.cache');

module.exports = function () {
  return merge.strategy({
    'module.rules': 'append',
  })(common, {
    mode: 'development',
    entry: {
      app: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        './src/client/index',
      ],
    },
    stats: 'minimal',
    devtool: 'eval-source-map', // 'cheap-module-eval-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Calories Tracking',
        favicon: path.resolve(path.join('public', 'favicon.ico')),
        template: path.resolve(path.join('src', 'client', 'index.html')),
        alwaysWriteToDisk: true,
        chunks: ['app'],
      }),
      new HtmlWebpackHarddiskPlugin({
        outputPath: path.resolve(path.join('public')),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|flow)$/,
          exclude: /(node_modules|bower_components|build|public|tools)/,
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: cachePath,
              },
            },
            {
              loader: 'babel-loader',
              query: {
                'presets': [
                  ['@babel/preset-env', {
                    'useBuiltIns': 'usage',
                    'corejs': 3,
                  }],
                  '@babel/react',
                ],
                'plugins': [
                  '@babel/plugin-proposal-object-rest-spread',
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import',
                  'react-hot-loader/babel',
                ],
              },
            },
          ],
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: cachePath,
              },
            },
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true,
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: __dirname,
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['node_modules'].map((d) => path.join(__dirname, d)),
                sourceMap: true,
              },
            },
            {
              loader: 'sass-resources-loader',
              options: { // @import all.scss
                sourceMap: true,
                resources: [
                  `${path.resolve(path.join('src', 'client', 'commons', 'styles'))}/all.scss`,
                ],
              },
            },
          ],
        },
      ],
    },
  });
};

