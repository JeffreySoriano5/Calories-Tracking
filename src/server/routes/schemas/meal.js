import {Joi} from '../../utils';

export const createSchema = {
  body: Joi.object().keys({
    text: Joi.string().max(100).required(),
    calories_count: Joi.number().required(),
    date: Joi.date().timestamp().required(),
  }).required(),
};

export const listSchema = {
  body: Joi.object().keys({
    date: Joi.date().timestamp(),
    start_date: Joi.date().timestamp(),
    end_date: Joi.date().timestamp(),
  }).min(1).without('date', ['start_date', 'end_date']).with('start_date', 'end_date').required(),
};

export const readSchema = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }).required(),
};

export const updateSchema = {
  params: Joi.object().keys({
    id: Joi.objectId().required(),
  }).required(),
  body: Joi.object().keys({
    text: Joi.string().max(100),
    calories_count: Joi.number(),
    date: Joi.date().timestamp(),
  }).min(1).required(),
};

export const deleteSchema = readSchema;
