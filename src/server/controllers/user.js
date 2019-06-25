import {asyncMiddleware} from '../utils';
import {getRbac} from '../startup/authorization';
import mongoose from 'mongoose';
import createError from 'http-errors';

const user_create_post = asyncMiddleware(async (req, res) => {
  const User = mongoose.model('User');
  const {password, ...data} = req.body;
  let user;

  try {
    user = await User.register(data, password);
  } catch (e) {
    if (e.name === 'UserExistsError') {
      return next(createError(409, e.message));
    }

    return next(e);
  }

  return res.json(user).status(201);
});

const user_get = asyncMiddleware(async (req, res) => {
  const User = mongoose.model('User');
  let user;

  try {
    user = await User.findById(req.params.id).exec();
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(user);
});

const user_list = asyncMiddleware(async (req, res) => {
  const User = mongoose.model('User');
  let user;

  try {
    user = await User.find(req.body).exec();
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(user);
});

const user_update = asyncMiddleware(async (req, res) => {
  const User = mongoose.model('User');
  let user;

  try {
    user = await User.findByIdAndUpdate(req.params.id, req.body);
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(user);
});

const user_delete = asyncMiddleware(async (req, res) => {
  const User = mongoose.model('User');

  try {
    await User.findByIdAndDelete(req.params.id);
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json().code(204);
});

const UserController = {
  user_create_post,
  user_get,
  user_list,
  user_update,
  user_delete,
};

export default UserController;
