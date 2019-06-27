export const SET_ACCOUNT_INFO = '@@ACCCOUNT/SET/INFO';
export const SET_SIGNUP_INFO = '@@ACCCOUNT/SET/SIGNUP/INFO';
export const LOGOUT_ACCOUNT = '@@ACCCOUNT/LOGOUT';

export function setAccountInfo(account) {
  return {
    type: SET_ACCOUNT_INFO,
    account,
  };
}

export function setSignUpInfo(email) {
  return {
    type: SET_SIGNUP_INFO,
    email,
  };
}

export function logout() {
  return {
    type: LOGOUT_ACCOUNT,
  };
}
