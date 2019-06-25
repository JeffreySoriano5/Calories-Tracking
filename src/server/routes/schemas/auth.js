import {Joi} from '../../utils';

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30).required(),
  }).required(),
};
