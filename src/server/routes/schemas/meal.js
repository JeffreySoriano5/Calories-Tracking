import {Joi} from '../../utils';

export const createSchema = Joi.object().keys({
  body: Joi.object().keys({
    text: Joi.string().max(100).required(),
    caloriesCount: Joi.number().required(),
    date: Joi.date().timestamp().required(),
  }).required(),
}).unknown(false);

export const listSchema = Joi.object().keys({
  body: Joi.object().keys({
    date: Joi.date().timestamp(),
    start_date: Joi.date().timestamp(),
    end_date: Joi.date().timestamp(),
  }).min(1).without('date', ['start_date', 'end_date']).with('start_date', 'end_date').required(),
}).unknown(false);

export const readSchema = Joi.object().keys({
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }).required(),
}).unknown(false);

export const updateSchema = Joi.object().keys({
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }).required(),
  body: Joi.object().keys({
    text: Joi.string().max(100),
    caloriesCount: Joi.number(),
    date: Joi.date().timestamp(),
  }).min(1).required(),
}).unknown(false);

export const deleteSchema = readSchema;
