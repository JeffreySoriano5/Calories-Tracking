import {Joi} from '../../utils';

export const createSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/).required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    calories_per_day: Joi.number().min(1).required(),
  }).required(),
};

export const listSchema = {
  query: Joi.object().keys({
    name: Joi.string().max(50).allow(''),
    calories_per_day_min: Joi.number(),
    calories_per_day_max: Joi.number(),
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
    sort: Joi.string().default('first_name'),
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
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    calories_per_day: Joi.number().min(1),
  }).min(1).required(),
};

export const deleteSchema = readSchema;
