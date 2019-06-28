const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
const path = require('path');
const appRootDir = require('app-root-dir');
const buildPath = path.resolve(appRootDir.get(), 'public', 'build');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const cachePath = path.resolve(__dirname, '.cache');
const currentYear = new Date().getFullYear();

const withCache = (process.env.CACHE === 'true');

const jsLoaders = [
  {
    loader: 'thread-loader',
    options: {
      // additional node.js arguments
      workerNodeArgs: ['--max-old-space-size=2048'],
      poolRespawn: true,
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
        'lodash',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
      ],
    },
  },
];
const cssLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: false,
    },
  },
  {
    loader: 'thread-loader',
    options: {
      // node-sass has a bug which blocks threads from the Node.js thread pool.
      // When using it with the thread-loader
      workerParallelJobs: 2,
      // additional node.js arguments
      workerNodeArgs: ['--max-old-space-size=2048'],
      poolRespawn: true,
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
];
const scssLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: false,
    },
  },
  {
    loader: 'thread-loader',
    options: {
      // node-sass has a bug which blocks threads from the Node.js thread pool.
      // When using it with the thread-loader
      workerParallelJobs: 2,
      // additional node.js arguments
      workerNodeArgs: ['--max-old-space-size=2048'],
      poolRespawn: true,
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
        path.resolve(path.join(appRootDir.get(), 'src', 'commons', 'styles', 'all.scss')),
      ],
    },
  },
];

if (withCache) {
  const cacheLoader = {
    loader: 'cache-loader',
    options: {
      cacheDirectory: cachePath,
    },
  };

  jsLoaders.unshift(cacheLoader);
  cssLoaders.unshift(cacheLoader);
  scssLoaders.unshift(cacheLoader);
}

module.exports = function() {
  return merge(common, {
    mode: 'production',
    entry: {
      app: [
        'bootstrap-loader/extractStyles',
        './src/Main',
      ],
      signup: [
        'bootstrap-loader/extractStyles',
        './src/Signup',
      ],
    },
    stats: {
      assetsSort: '!size',
      // Add information about cached (not built) modules
      cached: true,
      // Add namedChunkGroups information
      chunkGroups: true,
      // Sort the chunks by a field
      // You can reverse the sort with `!field`. Default is `id`.
      // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
      // For a complete list of fields see the bottom of the page
      chunksSort: 'issuer',
      // `webpack --colors` equivalent
      colors: true,
      // Add errors
      errors: true,
      // Add details to errors (like resolving log)
      errorDetails: true,
      // Add built modules information
      modules: false,
      // Show performance hint when file size exceeds `performance.maxAssetSize`
      performance: true,
      // Add warnings
      warnings: false,
    },
    devtool: 'source-map',
    output: {
      path: buildPath,
      filename: '[name].[contenthash:8].js',
      publicPath: `/assets/build/`,
    },
    plugins: [
      new CleanWebpackPlugin({
        verbose: false,
      }),
      new HtmlWebpackPlugin({
        title: 'CaloTracking',
        favicon: path.resolve(path.join(appRootDir.get(), 'public', 'favicon.ico')),
        template: path.resolve(path.join(appRootDir.get(), 'src', 'App.jsx.html')),
        chunks: ['app'],
        googleApiKey: `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}`,
        showErrors: true,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[id].[contenthash:8].css',
      }),
      new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20,
      }),
      new CompressionPlugin({
        minRatio: 0.7,
      }),
      new MomentTimezoneDataPlugin({
        startYear: currentYear - 2,
        endYear: currentYear + 10,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|flow)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /(node_modules|bower_components|build|public|tools)/,
          use: jsLoaders,
        },
        {
          test: /\.css$/,
          use: cssLoaders,
        },
        {
          test: /\.scss$/,
          use: scssLoaders,
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({
          cache: withCache ? cachePath : false,
          sourceMap: true,
          parallel: true,
          terserOptions: {
            ecma: 6,
          },
        }),
        new OptimizeCssAssetsPlugin({
          cssProcessor: require('cssnano'),
          canPrint: false,
        }),
      ],
    },
  });
};
