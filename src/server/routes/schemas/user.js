import {Joi} from '../../utils';

//TODO: add regex for password
//TODO: also modify on signup/signin and edit password
export const createSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30).required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    calories_per_day: Joi.number().min(1).required(),
  }).required(),
};

export const listSchema = {
  query: Joi.object().keys({
    name: Joi.string().max(50),
    calories_per_day_min: Joi.number(),
    calories_per_day_max: Joi.number(),
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
