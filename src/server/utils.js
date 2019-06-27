import joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

if (!joi.objectId) {
  joi.objectId = joiObjectId(joi);
}


export const parseSort = (sort) => {
  return sort.split(',').reduce((ac, key) => {
    if (key.startsWith('-')) ac[key.slice(1)] = -1;
    else ac[key] = 1;
    return ac;
  }, {});
};

export const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const Joi = joi;


