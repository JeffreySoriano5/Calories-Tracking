import {Joi} from '../../utils';

export const createSchema = {
  body: Joi.object().keys({
    text: Joi.string().max(100).required(),
    calories_count: Joi.number().required(),
    date: Joi.date().required(),
  }).required(),
};

export const listSchema = {
  query: Joi.object().keys({
    text: Joi.string().allow(''),
    min_calories: Joi.number(),
    max_calories: Joi.number(),
    start_date: Joi.date(),
    end_date: Joi.date(),
    start_time: Joi.string(),
    end_time: Joi.string(),
    all: Joi.default(false),
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
    sort: Joi.string().default('-date'),
  }),
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
    date: Joi.date(),
  }).min(1).required(),
};

export const deleteSchema = readSchema;
