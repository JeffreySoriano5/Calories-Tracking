import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import flow from 'lodash/flow';
import {withStyles} from '@material-ui/core/styles';
import {withAxios} from 'react-axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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

  onLogout = () => {
    this.props.axios.post('/auth/logout').then(() => {
      this.props.logout();
    });
  };

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              News
            </Typography>
            <Button color="inherit" onClick={this.onLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopMenu.propTypes = {
  history: PropTypes.object.isRequired,
};

const logoutConnector = connect(null, {logout});

export default flow(
  withStyles(styles),
  logoutConnector,
  withRouter,
  withAxios,
)(TopMenu);
