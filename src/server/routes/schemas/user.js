import {Joi} from '../../utils';

export const createSchema = Joi.object().keys({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30).required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    caloriesPerDay: Joi.number().min(1).required(),
  }).required(),
}).unknown(false);

export const listSchema = Joi.object().keys({
  body: Joi.object().keys({
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    caloriesPerDay: Joi.number(),
  }).min(1).required(),
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
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    caloriesPerDay: Joi.number().min(1),
  }).min(1).required(),
}).unknown(false);

export const deleteSchema = readSchema;
