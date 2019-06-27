import {SET_ACCOUNT_INFO, SET_SIGNUP_INFO, LOGOUT_ACCOUNT} from '../actions/auth';

const initialState = {
  user: null,
  signup: null,
};

export default function account(state = initialState, action) {
  switch (action.type) {
    case SET_ACCOUNT_INFO:
      return {
        user: {
          ...action.account,
        },
        signup: null,
      };
    case SET_SIGNUP_INFO:
      return {
        ...state,
        signup: {
          email: action.email,
        },
      };
    case LOGOUT_ACCOUNT:
      return {
        user: null,
        signup: null,
      };
    default:
      return state;
  }
}
