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
import {logout} from 'common/redux/actions/auth'

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

class TopMenu extends React.Component {
  state = {
    menuAnchor: null,
  };

  onLogout = () => {
    this.props.axios.post('/auth/logout').then(() => {
      this.props.logout();
    });
  };

  onMenuOpen = (event) => {
    this.setState({menuAnchor: event.currentTarget})
  };

  onMenuClose = () => {
    this.setState({menuAnchor: null})
  };

  render() {
    const {classes} = this.props;

    const anchor = this.state.menuAnchor;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              News
            </Typography>
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
  withRouter,
  withAxios,
)(TopMenu);
