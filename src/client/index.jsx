import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import {createBrowserHistory} from 'history';
import Log from 'common/utils/log';
import Root from 'views/Root';
import {configure} from './store';

const auth = window.auth;

Log.info('Auth credentials come from backend', auth);

const history = createBrowserHistory({
  basename: '/',
});

const store = configure({
  auth: auth,
});

const concurrent = true; // it could come from window.__CONCURRENT_RENDERING__

const render = (Comp, concurrent = false) => {
  const element = (
    <AppContainer>
      <React.StrictMode>
        <Comp
          store={store}
          history={history}
        />
      </React.StrictMode>
    </AppContainer>
  );

  if (concurrent) {
    // unstable for now *(24/05/2019)* but use concurrent rendering
    ReactDOM.unstable_createRoot(document.getElementById('root')).render(element);
  } else {
    // stable method, single thread of rendering
    ReactDOM.render(element, document.getElementById('root'));
  }
};

if (module.hot) module.hot.accept('./views/Root', () => {
  const NextRoot = require('./views/Root');
  render(NextRoot, concurrent);
});

render(Root, concurrent);
