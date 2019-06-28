import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import {withStyles} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {withRouter} from 'react-router';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
});

class NotFound extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="h5" component="h3">
            404 Page Not Found.
          </Typography>
          <Typography component="p">
            The Page you are looking for does not exist.
          </Typography>
        </Paper>
      </div>
    );
  }
}


NotFound.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object,
  match: PropTypes.object,
  classes: PropTypes.object,
};

export default flow(
  withStyles(styles),
  withRouter,
)(NotFound);
