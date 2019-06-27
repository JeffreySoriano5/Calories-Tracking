import createError from 'http-errors';
import {asyncMiddleware} from '../utils';
import mongoose from 'mongoose';

const user_signUp_post = asyncMiddleware(async (req, res, next) => {
  const User = mongoose.model('User');
  const {password, ...data} = req.body;

  try {
    let user = await User.register(data, password);
    user = await user.toPlainObject();

    return res.json(user).status(201);
  } catch (e) {
    if (e.name === 'UserExistsError') {
      return next(createError(409, e.message));
    }

    return next(e);
  }
});

const user_login_post = asyncMiddleware(async (req, res) => {
  const user = await req.user.toPlainObject();

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
