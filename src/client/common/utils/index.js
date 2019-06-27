import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import validate from 'validate.js';
import includes from 'lodash/includes';
import get from 'lodash/get';


const accountConnector = connect(createSelector(
  (state) => state.auth,
  (user) => (user),
), null, null, {forwardRef: true});

const hasPermissions = (user, permissions) => {
  if (!get(user, 'permissions', false)) return false;

  return permissions.every((reqPerm) => {
    return includes(user.permissions, reqPerm);
  });
};

const isRequired = value => {
  return (validate.isEmpty(value)) ? 'Required' : undefined;
};


const maxLength = max => value => {
  return (value && value.length && value.length > max) ? `Maximum of ${max} characters` : undefined;
};

const minLength = min => value => {
  return (value && value.length && value.length < min) ? `Minimum of ${min} characters` : undefined;
};

const isNumber = value => {
  value = parseInt(value);
  return (validate.isInteger(value)) ? undefined : 'Must be a number';
};

const minValue = min => value => {
  value = parseInt(value);
  return (value && value < min) ? `Must be greater than ${min}` : undefined;
};

const maxValue = max => value => {
  value = parseInt(value);
  return (value && value > max) ? `Must be less than ${max}` : undefined;
};

const isEmail = value => {
  const error = validate({value}, {
    value: {email: true},
  });

  return (error) ? 'Must be a valid email' : undefined;
};

const isEqual = (toCompare, name) => value => {
  return (value && toCompare && value !== toCompare) ? `${name} must match` : undefined;
};

const regex = (regex, message) => value => {
  if (value) {
    const matches = value.match(regex);
    if (!matches) return message;
  }
};

const numberIsEqual = (a, b) => {
  return parseInt(a) === parseInt(b);
};

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

const validators = {
  isRequired,
  isEqual,
  isEmail,
  isNumber,
  minLength,
  maxLength,
  minValue,
  maxValue,
  regex,
};

export {
  accountConnector,
  hasPermissions,
  validators,
  composeValidators,
  numberIsEqual,
};
