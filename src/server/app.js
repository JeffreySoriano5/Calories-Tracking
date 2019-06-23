import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import mustache from 'mustache-express';
import {RBAC} from 'rbac';

import indexRouter from './routes';
import usersRouter from './routes/users';
import models, {connectDb} from './models';

const getApp = async function () {
  const app = express();

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

  //INITIALIZE RBAC
  const rbac = new RBAC({
    roles: ['admin', 'user', 'manager'],
    permissions: {
      user: ['create', 'read', 'update', 'delete'],
      password: ['change'],
      meal: ['create', 'read', 'update', 'delete'],
    },
    grants: {
      user: ['change_password', 'create_meal', 'read_meal', 'update_meal', 'delete_meal'],
      manager: ['create_user', 'delete_user', 'update_user', 'delete_user'],
      admin: ['user', 'manager'],
    },
  });

  await rbac.init();

  //ROUTES (order maters)
  //=======================================================================
  app.use('/api/users', usersRouter);
  //wil match any routes which dont match the ones above
  app.use('/', indexRouter);
  //=======================================================================


  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });


  await connectDb();

  return app;
};

export default getApp;
