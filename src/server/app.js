import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import mustache from 'mustache-express';
import setupAuthentication from './startup/authentication';
import setupAuthorization from './startup/authorization';
import {connectDb} from './models';

import indexRouter from './routes';
import apiRouter from './routes/api';

//TODO: implement permissions and roles

const getApp = async function () {
  let app = express();

  // view engine setup
  app.engine('html', mustache());
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '..', '..', 'public'));

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cookieParser());


  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', '..', 'public')));
  } else {
    // so it does not need to include webpack dependencies in production
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('../../webpack.dev');

    const config = webpackConfig();
    const publicPath = config.output.publicPath;
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {
      publicPath,
    }));

    app.use(webpackHotMiddleware(compiler, {
      publicPath,
    }));
  }

  app.use(sassMiddleware({
    src: path.join(__dirname, '..', '..', 'public'),
    dest: path.join(__dirname, '..', '..', 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    force: true,
  }));

  await connectDb();

  setupAuthentication(app);
  await setupAuthorization(app);

  app.use('/api', apiRouter);
  app.use('/', indexRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  // Even if you don’t need to use the next object, you must specify it to maintain the signature
  app.use(function (err, req, res, next) { //eslint-disable-line
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json(err);
  });

  return app;
};

export default getApp;
