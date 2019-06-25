import {asyncMiddleware} from '../utils';
import mongoose from 'mongoose';
import createError from 'http-errors';

const meal_create_post = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  try {
    const meal = await Meal.create(req.body);
    return res.json(meal.toObject()).status(201);
  } catch (e) {
    return next(e);
  }
});

const meal_get = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  try {
    const meal = await Meal.findById(req.params.id).exec();
    if (!meal) return next(createError(404, 'Meal not found'));

    return res.json(meal.toObject());
  } catch (e) {
    return next(e);
  }
});

const meal_list = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  //TODO: make queries depending on the arguments passed, maybe take into account pagination
  //TODO: to object each
  try {
    const meals = await Meal.find(req.query).exec();
    return res.json(meals);
  } catch (e) {
    return next(e);
  }
});

const meal_update = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  try {
    let meal = await Meal.findById(req.params.id).exec();
    if (!meal) return next(createError(404, 'Meal not found'));

    meal.set(req.body);
    if (meal.isModified()) meal = await meal.save();

    return res.json(meal.toObject());
  } catch (e) {
    return next(e);
  }
});

const meal_delete = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  try {
    const meal = await Meal.findById(req.params.id).exec();
    if (!meal) return next(createError(404, 'Meal not found'));

    await meal.remove();

    return res.json().status(204);
  } catch (e) {
    return next(e);
  }
});

const MealController = {
  meal_create_post,
  meal_get,
  meal_list,
  meal_update,
  meal_delete,
};

export default MealController;
