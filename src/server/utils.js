import joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

if (!joi.objectId) {
  joi.objectId = joiObjectId(joi);
}

export const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const Joi = joi;
