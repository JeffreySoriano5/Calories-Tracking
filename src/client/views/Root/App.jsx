import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import flow from 'lodash/flow';
import {withRouter} from 'react-router';
import {accountConnector} from 'common/utils';
// views
import Home from 'views/Home';
import Login from 'views/Login';
import SignUp from 'views/SignUp';

import TopMenu from './components/TopMenu';

class AuthRoute extends PureComponent {

  parseQueryString = (location) => {
    let query = {};

    if (!isEmpty(location.search)) {
      query = queryString.parse(location.search);
    }

    Object.assign(location, {query});
  };

  render() {
    const {component: Component, redirect, ...rest} = this.props;

    return (
      <Route {...rest} render={(props) => {
        const hasUser = !isEmpty(rest.user);
        const to = hasUser ? null : '/login';

        if (redirect === false && to) {
          return null;
        }

        this.parseQueryString(props.location);

        return (to) ? (
          <Redirect to={{
            pathname: to,
            state: {from: props.location},
          }}/>
        ) : (
          <Component {...rest} location={props.location}/>
        );
      }}/>
    );
  }
}

AuthRoute.propTypes = {
  component: PropTypes.any.isRequired,
  redirect: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

/**
 * App frame. Parent to all other views
 * @class App
 * @extends {React.Component}
 */
class App extends React.Component {
  /**
   * Render Component
   * @return {React.Component}
   */
  render() {
    const {user} = this.props;
    const routes = [];

    const nonAuthRoutes = [
      <Route exact path="/login" key="login" component={Login}/>,
      <Route exact path="/signUp" key="signUp" component={SignUp}/>
    ];

    if (!user) routes.push(...nonAuthRoutes);

    routes.push(<AuthRoute path="/" exact key="home" component={Home} user={user}/>);

    return (
      <div className="app">
        <AuthRoute redirect={false} path="/" component={TopMenu} user={user}/>
        <Switch>
          {routes}
          <Redirect to="/"/>
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

App.defaultProps = {
  user: null,
};

export default flow(
  withRouter,
  accountConnector,
)(App);

