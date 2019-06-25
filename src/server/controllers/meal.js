import {asyncMiddleware} from '../utils';
import mongoose from 'mongoose';
import createError from 'http-errors';

const meal_create_post = asyncMiddleware(async (req, res) => {
  const Meal = mongoose.model('Meal');
  let meal;

  try {
    meal = await Meal.create(req.body);
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(meal).status(201);
});

const meal_get = asyncMiddleware(async (req, res) => {
  const Meal = mongoose.model('Meal');
  let meal;

  try {
    meal = await Meal.findById(req.params.id).exec();
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(meal);
});

const meal_list = asyncMiddleware(async (req, res) => {
  const Meal = mongoose.model('Meal');
  let meal;

  try {
    meal = await Meal.find(req.body).exec();
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(meal);
});

const meal_update = asyncMiddleware(async (req, res) => {
  const Meal = mongoose.model('Meal');
  let meal;

  try {
    meal = await Meal.findByIdAndUpdate(req.params.id, req.body);
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json(meal);
});

const meal_delete = asyncMiddleware(async (req, res) => {
  const Meal = mongoose.model('Meal');

  try {
    await Meal.findByIdAndDelete(req.params.id);
  } catch (e) {
    debugger;
    return next(e);
  }

  return res.json().code(204);
});

const MealController = {
  meal_create_post,
  meal_get,
  meal_list,
  meal_update,
  meal_delete,
};

export default MealController;
