import {asyncMiddleware, parseSort} from '../utils';
import mongoose from 'mongoose';
import createError from 'http-errors';
import get from 'lodash/get';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

const dateFns = new DateFnsUtils();

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

    if (meal.user.toString() !== authUser.id) {
      const hasPermission = await req.user.can('read', 'meal');
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
  const date = get(req, 'query.date', null);
  const startDate = get(req, 'query.start_date', null);
  const endDate = get(req, 'query.end_date', null);
  const startTime = get(req, 'query.start_time', null);
  const endTime = get(req, 'query.end_time', null);


  try {
    let aggregatePipeline = [];
    const matchQuery = {};
    const matchAnd = [];

    const hasAllPermission = await req.user.can('read', 'meal');

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

    if (date) {
      let start = moment(date).startOf('day').utc();
      let end = moment(date).endOf('day').utc();

      datesMatchAnd.push(...[{
        date: {'$gte': start.toDate()},
      }, {
        date: {'$lte': end.toDate()},
      }]);
    }

    if (startDate) {
      const initialDate = dateFns.date(startDate);
      const dateStr = dateFns.format(initialDate, 'yyyy-MM-dd');
      datesMatchAnd.push({formatted_date: {'$gte': dateStr}});
    }

    if (endDate) {
      const initialDate = dateFns.date(endDate);
      const dateStr = dateFns.format(initialDate, 'yyyy-MM-dd');
      datesMatchAnd.push({formatted_date: {'$lte': dateStr}});
    }

    if (startTime) datesMatchAnd.push({formatted_time: {'$gte': startTime}});
    if (endTime) datesMatchAnd.push({formatted_time: {'$lte': endTime}});

    aggregatePipeline.push({
      '$match': {
        '$and': datesMatchAnd,
      },
    });

    const countDoc = await Meal.aggregate([].concat(aggregatePipeline, [
      {
        '$group': {
          _id: null,
          total: {'$sum': 1},
          total_calories: {'$sum': '$calories_count'},
        },
      },
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

    if (getAll) {
      aggregatePipeline.push({
        '$lookup': {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      });
    }

    let meals = await Meal.aggregate(aggregatePipeline).exec();

    meals = meals.map((meal) => {
      if (getAll) meal.user = meal.user[0];
      meal.id = meal._id;
      return meal;
    });

    return res.json({
      items: meals,
      total: get(countDoc, '0.total', 0),
      total_calories: get(countDoc, '0.total_calories', 0),
      page,
    });
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

    if (mealObj.user.toString() !== authUser.id) {
      const hasPermission = await req.user.can('update', 'meal');
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

    const mealObj = meal.toObject();
    const authUser = req.user.toObject();

    if (mealObj.user.toString() !== authUser.id) {
      const hasPermission = await req.user.can('delete', 'meal');
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
