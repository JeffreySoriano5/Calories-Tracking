import mongoose from 'mongoose';
import createError from 'http-errors';
import get from 'lodash/get';
import {asyncMiddleware} from '../utils';

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
  const name = get(req, 'query.name', null);
  const minCalories = get(req, 'query.calories_per_day_min', null);
  const maxCalories = get(req, 'query.calories_per_day_max', null);

  const q = {};
  const and = [];

  if (name) {
    const searchValue = new RegExp(name, 'gi');

    and.push({
      '$or': [
        {first_name: searchValue},
        {last_name: searchValue},
      ],
    });
  }

  if (minCalories) and.push({calories_per_day: {'$gte': minCalories}});
  if (maxCalories) and.push({calories_per_day: {'$lte': maxCalories}});

  if (and.length) q['$and'] = and;

  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;

  try {
    let users = await User.paginate(q, {sort, page, limit}).exec();
    users = users.map((user) => user.toObject());

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
