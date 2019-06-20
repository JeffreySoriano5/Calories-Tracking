import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import authReducer from 'common/redux/reducers/auth';

let finalCreateStore, store;

const getReducers = function () {
  const root = combineReducers({
    auth: authReducer,
  });

  return {
    root,
  };
};

export function getStore() {
  return store;
}

/**
 * Configure Redux Store.
 * @param {Object} apollo Apollo client.
 * @param {Object} initialState Initial redux state.
 * @return {Object} Redux compose store.
 */
export function configure(initialState = {}) {
  if (store) {
    return store;
  }

  const {root} = getReducers();

  if (process.env.NODE_ENV === 'production') {
    finalCreateStore = compose()(createStore);
  } else {
    finalCreateStore = composeWithDevTools(
      applyMiddleware(createLogger({collapsed: true})),
    )(createStore);
  }

  store = finalCreateStore(root, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../views/Root', () => {
      const nextRootReducer = getReducers().root;
      store.replaceReducer(...nextRootReducer);
    });
  }

  return store;
}
