import {SET_ACCOUNT_INFO, LOGOUT_ACCOUNT} from '../actions/auth';

export default function account(state = null, action) {
  switch (action.type) {
    case SET_ACCOUNT_INFO:
      return {
        ...state,
        ...action.account,
      };
    case LOGOUT_ACCOUNT:
      return null;
    default:
      return state;
  }
}
