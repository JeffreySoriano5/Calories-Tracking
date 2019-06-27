import {asyncMiddleware, parseSort} from '../utils';
import mongoose from 'mongoose';
import createError from 'http-errors';
import get from 'lodash/get';
import compact from 'lodash/compact';
import {getRbac as getAuthorization} from '../startup/authorization';

const meal_create_post = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');
  const data = req.body;

  data.user = req.user._id;

  try {
    const meal = await Meal.create(data);
    return res.json(meal.toObject()).status(201);
  } catch (e) {
    return next(e);
  }
});

const meal_get = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  try {
    let meal = await Meal.findById(req.params.id).exec();
    if (!meal) return next(createError(404, 'Meal not found'));

    meal = meal.toObject();
    const authUser = req.user.toObject();
    const rbac = getAuthorization();

    if (meal.user !== authUser.id) {
      const hasPermission = await req.user.can(rbac, 'read', 'meal');
      if (!hasPermission) return next(createError(404));
    }

    return res.json(meal);
  } catch (e) {
    return next(e);
  }
});

const meal_list = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  let getAll = get(req, 'query.all', false);
  const text = get(req, 'query.text', null);
  const minCalories = get(req, 'query.min_calories', null);
  const maxCalories = get(req, 'query.max_calories', null);
  const startDate = get(req, 'query.start_date', null);
  const endDate = get(req, 'query.end_date', null);
  const startTime = get(req, 'query.start_time', null);
  const endTime = get(req, 'query.end_time', null);
  const hasDate = Boolean(compact([startDate, endDate, startTime, endTime]).length);

  //TODO: validate dates and times
  //Expect 24 hour format for time (HH:MM)
  //Expect YYYY-MM-DD format for date

  try {
    let aggregatePipeline = [];
    const matchQuery = {};
    const matchAnd = [];

    const hasAllPermission = await req.user.can(getAuthorization(), 'read', 'meal');

    if (getAll && !hasAllPermission) getAll = false;
    if (!getAll) matchAnd.push({user: req.user._id});

    if (text) matchAnd.push({text: new RegExp(text, 'gi')});
    if (minCalories) matchAnd.push({calories_count: {'$gte': minCalories}});
    if (maxCalories) matchAnd.push({calories_count: {'$lte': maxCalories}});

    if (matchAnd.length) matchQuery['$and'] = matchAnd;

    aggregatePipeline.push({'$match': matchQuery});

    aggregatePipeline.push({
      '$addFields': {
        formatted_date: {
          '$dateToString': {
            format: '%Y-%m-%d',
            date: '$date',
          },
        },
        formatted_time: {
          '$dateToString': {
            format: '%H:%M',
            date: '$date',
          },
        },
      },
    });

    const datesMatchAnd = [];

    if (startDate) datesMatchAnd.push({formatted_date: {'$gte': startDate}});
    if (endDate) datesMatchAnd.push({formatted_date: {'$lte': endDate}});
    if (startTime) datesMatchAnd.push({formatted_time: {'$gte': startTime}});
    if (endTime) datesMatchAnd.push({formatted_time: {'$lte': endTime}});

    if (hasDate) {
      aggregatePipeline.push({
        '$match': {
          '$and': datesMatchAnd,
        },
      });
    }

    const countDoc = await Meal.aggregate([].concat(aggregatePipeline, [
      {'$count': 'total'},
    ])).exec();

    const limit = req.query.limit;
    const page = req.query.page;
    const sort = req.query.sort;
    const skip = (page - 1) * limit;

    aggregatePipeline = [].concat(aggregatePipeline, [
      {'$sort': parseSort(sort)},
      {'$skip': skip},
      {'$limit': skip + limit},
    ]);

    let meals = await Meal.aggregate(aggregatePipeline).exec();

    meals = meals.map((meal) => {
      meal.id = meal._id;
      return meal;
    });

    return res.json({items: meals, total: get(countDoc, '0.total', 0), page});
  } catch (e) {
    return next(e);
  }
});

const meal_update = asyncMiddleware(async (req, res, next) => {
  const Meal = mongoose.model('Meal');

  try {
    let meal = await Meal.findById(req.params.id).exec();
    if (!meal) return next(createError(404, 'Meal not found'));

    const mealObj = meal.toObject();
    const authUser = req.user.toObject();
    const rbac = getAuthorization();

    if (mealObj.user !== authUser.id) {
      const hasPermission = await req.user.can(rbac, 'update', 'meal');
      if (!hasPermission) return next(createError(404));
    }

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
    let meal = await Meal.findById(req.params.id).exec();
    if (!meal) return next(createError(404, 'Meal not found'));

    meal = meal.toObject();
    const authUser = req.user.toObject();
    const rbac = getAuthorization();

    if (meal.user !== authUser.id) {
      const hasPermission = await req.user.can(rbac, 'delete', 'meal');
      if (!hasPermission) return next(createError(404));
    }

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
