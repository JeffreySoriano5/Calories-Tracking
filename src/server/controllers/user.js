import {asyncMiddleware} from '../utils';
import mongoose from 'mongoose';
import createError from 'http-errors';

const user_create_post = asyncMiddleware(async (req, res, next) => {
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

const user_get = asyncMiddleware(async (req, res, next) => {
  const User = mongoose.model('User');

  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) return next(createError(404, 'User not found'));

    return res.json(user.toObject());
  } catch (e) {
    return next(e);
  }

});

const user_list = asyncMiddleware(async (req, res, next) => {
  const User = mongoose.model('User');

  //TODO: make queries depending on the arguments passed, maybe take into account pagination
  //TODO: to object each
  try {
    const users = await User.find(req.query).exec();
    return res.json(users);
  } catch (e) {
    return next(e);
  }
});

const user_update = asyncMiddleware(async (req, res, next) => {
  const User = mongoose.model('User');

  try {
    let user = await User.findById(req.params.id).exec();
    if (!user) return next(createError(404, 'User not found'));

    user.set(req.body);
    if (user.isModified()) user = await user.save();

    return res.json(user.toObject());
  } catch (e) {
    return next(e);
  }
});

const user_delete = asyncMiddleware(async (req, res, next) => {
  const User = mongoose.model('User');

  try {
    let user = await User.findById(req.params.id).exec();
    if (!user) return next(createError(404, 'User not found'));

    await user.remove();

    return res.json().status(204);
  } catch (e) {
    return next(e);
  }
});

const UserController = {
  user_create_post,
  user_get,
  user_list,
  user_update,
  user_delete,
};

export default UserController;
