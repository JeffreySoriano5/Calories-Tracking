import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import flow from 'lodash/flow';
import {withRouter} from 'react-router';
import {accountConnector, hasPermissions} from 'common/utils';
// views
import Login from 'views/Login';
import SignUp from 'views/SignUp';
import Home from 'views/Home';
import Users from 'views/Users';

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
        const needsPerm = Array.isArray(rest.permissions) && !isEmpty(rest.permissions);
        let to = (hasUser) ? null : '/login';

        if (redirect === false && to) return null;

        if (needsPerm) {
          const hasAll = hasPermissions(rest.user, rest.permissions);

          if (!hasAll) to = '/not-found';
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
  withRole: PropTypes.array,
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
    let routes = [];

    const nonAuthRoutes = [
      <Route exact path="/login" key="login" component={Login}/>,
      <Route exact path="/signUp" key="signUp" component={SignUp}/>
    ];

    if (!user) routes.push(...nonAuthRoutes);

    routes = routes.concat([
      <AuthRoute path="/" exact key="home" component={Home} user={user}/>,
      <AuthRoute path="/users" exact key="users" permissions={['read_user']} component={Users} user={user}/>,
      <Route exact path="/not-found" key="not-found" render={() => <div>NOT FOUND</div>}/>
    ]);

    return (
      <div className="app">
        <AuthRoute redirect={false} path="/" component={TopMenu} user={user}/>
        <Switch>
          {routes}
          <Redirect to="/not-found"/>
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

