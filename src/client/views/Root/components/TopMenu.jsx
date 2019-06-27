import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import flow from 'lodash/flow';
import {withStyles} from '@material-ui/core/styles';
import {withAxios} from 'react-axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {connect} from 'react-redux';
import {NavLink} from "react-router-dom";
import {logout} from 'common/redux/actions/auth'
import {accountConnector, hasPermissions} from 'common/utils';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  filler: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    marginRight: theme.spacing(2),
    color: theme.palette.common.white,
  }
});

class TopMenu extends React.Component {
  state = {
    menuAnchor: null,
  };

  onLogout = () => {
    this.props.axios.post('/auth/logout').then(() => {
      this.props.logout();
      this.props.history.push('/login');
    });
  };

  onMenuOpen = (event) => {
    this.setState({menuAnchor: event.currentTarget})
  };

  onMenuClose = () => {
    this.setState({menuAnchor: null})
  };

  render() {
    const {classes, user} = this.props;

    const anchor = this.state.menuAnchor;
    const activeStyle = {};

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <NavLink exact to='/' activeStyle={activeStyle} className={classes.link}>
              <Typography variant="h6">
                Meals
              </Typography>
            </NavLink>
            {user && hasPermissions(user, ['read_user']) &&
            <NavLink exact to='/users' activeStyle={activeStyle} className={classes.link}>
              <Typography variant="h6">
                Users
              </Typography>
            </NavLink>
            }
            <div className={classes.filler}/>
            <IconButton
              onClick={this.onMenuOpen}
              color="inherit"
            >
              <AccountCircle/>
            </IconButton>
            <Menu id="user-menu"
                  DanchorEl={anchor}
                  keepMounted
                  open={Boolean(anchor)}
                  onClose={this.onMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={this.onLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopMenu.propTypes = {
  history: PropTypes.object.isRequired,
  axios: PropTypes.object,
  logout: PropTypes.func,
  classes: PropTypes.object,
};

const logoutConnector = connect(null, {logout});

export default flow(
  withStyles(styles),
  logoutConnector,
  accountConnector,
  withRouter,
  withAxios,
)(TopMenu);
