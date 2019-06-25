import {Joi} from '../../utils';

export const createSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30).required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    caloriesPerDay: Joi.number().min(1).required(),
  }).required(),
};

export const listSchema = {
  body: Joi.object().keys({
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    caloriesPerDay: Joi.number(),
  }).min(1).required(),
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
    caloriesPerDay: Joi.number().min(1),
  }).min(1).required(),
};

export const deleteSchema = readSchema;
