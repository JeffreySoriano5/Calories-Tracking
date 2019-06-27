import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {Redirect, Route, Switch} from 'react-router-dom';
import flow from 'lodash/flow';
import {withRouter} from 'react-router';
import {accountConnector, hasPermissions} from 'common/utils';
import CssBaseline from '@material-ui/core/CssBaseline';
// views
import Login from 'views/Login';
import SignUp from 'views/SignUp';
import Home from 'views/Home';
import Users from 'views/Users';
import Profile from 'views/Profile';

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

        if (hasUser && needsPerm) {
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

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

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
    const {user, classes} = this.props;
    let routes = [];

    const nonAuthRoutes = [
      <Route exact path="/login" key="login" component={Login}/>,
      <Route exact path="/signUp" key="signUp" component={SignUp}/>
    ];

    if (!user) routes.push(...nonAuthRoutes);

    routes = routes.concat([
      <AuthRoute path="/" exact key="home" component={Home} user={user}/>,
      <AuthRoute path="/users" exact key="users" permissions={['read_user']} component={Users} user={user}/>,
      <AuthRoute path="/profile" exact key="profile" component={Profile} user={user}/>,
      <Route exact path="/not-found" key="not-found" render={() => <div>NOT FOUND</div>}/>
    ]);
    //TODO:Create 404 page
    return (
      <div className={classes.root}>
        <CssBaseline/>
        <AuthRoute redirect={false} path="/" component={TopMenu} user={user}/>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Switch>
            {routes}
            <Redirect to="/not-found"/>
          </Switch>
        </main>
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
  classes: PropTypes.object,
};

App.defaultProps = {
  user: null,
};

export default flow(
  withStyles(styles),
  withRouter,
  accountConnector,
)(App);

