import {SET_ACCOUNT_INFO} from '../actions/auth';

export default function session(state = null, action) {
  switch (action.type) {
    case SET_ACCOUNT_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
