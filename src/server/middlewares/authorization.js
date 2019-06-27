import createError from 'http-errors';
import {asyncMiddleware} from '../utils';

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(createError(401));
  }

  next();
};

const can = (action, resource) => {
  return asyncMiddleware(async (req, res, next) => {
    const user = req.user;

    const hasPermission = await user.can(action, resource);

    if (!hasPermission) return next(createError(403));

    next();
  });
};

export default {
  can,
  isAuthenticated,
};
