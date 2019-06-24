import {asyncMiddleware} from '../utils';
import mongoose from 'mongoose';

const user_signUp_post = asyncMiddleware(async (req, res) => {
  const User = mongoose.model('User');
  const {password, ...data} = req.body;

  let user = await User.register(data, password);

  return res.json(user).status(201);
});

const user_login_post = (req, res) => {
  return res.json(req.user);
};

const user_logout_post = (req, res) => {
  req.logout();
  return res.json().code(204);
};

export default {
  user_signUp_post,
  user_login_post,
  user_logout_post,
};
