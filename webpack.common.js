const path = require('path');
const buildPath = path.resolve('public', 'build');
const commonsSrc = path.resolve(path.join('src', 'client', 'common'));
const viewsSrc = path.resolve('src', 'client', 'views');
const storeSrc = path.resolve('src', 'client', 'store');
const fs = require('fs');

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}

module.exports = {
  target: 'web',
  watch: false,
  externals: {},
  output: {
    path: buildPath,
    filename: '[name].js',
    publicPath: `/build/`,
    chunkFilename: '[name].js',
    // When in node mode we will output our bundle as a commonjs2 module.
    libraryTarget: 'var',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx'],
    alias: {
      'views': viewsSrc,
      'common': commonsSrc,
      'store': storeSrc,
      'components': path.resolve(path.join(commonsSrc, 'components')),
      'styles': path.resolve(path.join(commonsSrc, 'styles')),
      'public': path.resolve(path.join('public')),
      'fonts': path.resolve(path.join('public', 'fonts')),
      'images': path.resolve(path.join('public', 'images')),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|svg|ttf|otf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            query: {
              emitFile: true,
            },
          },
        ],
      },
    ],
  },
  node: {
    net: 'empty',
  },
};

