import {Joi} from '../utils';

/**
 * Route validation using Joi
 * Takes a schema with properties defined using Joi:
 *  - params
 *  - body
 *  - query
 * Validates the request properties specified in the schema
 * @param {Object} schema { params, body, query }
 */
export default (schema) => (
  (req, res, next) => {
    if (!schema) {
      return next();
    }

    const obj = {};

    ['params', 'body', 'query'].forEach((key) => {
      if (schema[key]) {
        obj[key] = req[key];
      }
    });

    return Joi.validate(obj, schema, {abortEarly: false}, (err) => {
      if (err) {
        const paths = err.details.map((detail) => detail.path.join('.'));
        const message = `Bad Request. Errors in paths ${paths.join(', ')}`;

        return res.status(400).json({message, details: err.details}).end();
      }

      return next();
    });
  }
);

