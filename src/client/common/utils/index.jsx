import {connect} from 'react-redux';
import {createSelector} from 'reselect';

export function getCookie(cname) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

export const accountConnector = connect(createSelector(
  (state) => state.auth,
  (user) => ({
    user
  }),
), null, null, {forwardRef: true});


export default {
  getCookie,
  accountConnector,
};
