const path = require('path');

const webpackConfig = require('../../webpack.common.js');

webpackConfig.resolve.root = path.resolve(path.join('..', '..'));

module.exports = {
  'extends': [
    "eslint:recommended",
    "plugin:react/recommended",
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  'settings': {
    "react": {
      "version": "detect",
    },
    'import/resolver': {
      'webpack': {
        'config': webpackConfig,
      },
    },
  },
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'arrowFunctions': true,
      'binaryLiterals': true,
      'blockBindings': true,
      'classes': true,
      'defaultParams': true,
      'destructuring': true,
      'forOf': true,
      'generators': true,
      'modules': true,
      'objectLiteralComputedProperties': true,
      'objectLiteralDuplicateProperties': true,
      'objectLiteralShorthandMethods': true,
      'objectLiteralShorthandProperties': true,
      'octalLiterals': true,
      'regexUFlag': true,
      'regexYFlag': true,
      'spread': true,
      'superInFunctions': true,
      'templateStrings': true,
      'unicodeCodePointEscapes': true,
      'globalReturn': true,
      'jsx': true,
      'experimentalObjectRestSpread': true,
    },
  },
  'plugins': [
    'react',
    'babel',
  ],
  'rules': {
    'strict': 0,
    'require-jsdoc': 0,
    'max-len': [
      'error', {
        'code': 120,
        'tabWidth': 2,
        'ignoreComments': true,
        'ignoreTrailingComments': true,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      },
    ],
    'no-console': 1,
    'prefer-const': 'error',
    'one-var': [
      'warn',
      {"initialized": "never", "uninitialized": "always"}
    ],
    'no-multi-spaces': [
      'warn',
      {
        'exceptions': {
          'Property': true,
          'VariableDeclarator': true,
          'ImportDeclaration': true,
        },
      },
    ],
    'no-invalid-this': 'off',
    'babel/no-invalid-this': 'off',
  },
};
