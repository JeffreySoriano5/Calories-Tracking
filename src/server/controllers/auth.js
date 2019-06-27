import createError from 'http-errors';
import {asyncMiddleware} from '../utils';
import mongoose from 'mongoose';
import {getRbac} from '../startup/authorization';

const user_signUp_post = asyncMiddleware(async (req, res, next) => {
  const User = mongoose.model('User');
  const {password, ...data} = req.body;

  try {
    const user = await User.register(data, password);
    return res.json(user.toObject()).status(201);
  } catch (e) {
    if (e.name === 'UserExistsError') {
      return next(createError(409, e.message));
    }

    return next(e);
  }
});

const user_login_post = asyncMiddleware(async (req, res) => {
  const user = req.user.toObject();
  user.permissions = await req.user.getScope(getRbac());

  return res.json(user);
});

const user_logout_post = (req, res) => {
  req.logout();
  return res.json().status(204);
};

export default {
  user_signUp_post,
  user_login_post,
  user_logout_post,
};
