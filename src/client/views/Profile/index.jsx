import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import omit from 'lodash/omit';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {withAxios} from 'react-axios';
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import {setAccountInfo} from 'common/redux/actions/auth'
import UserForm from 'common/components/UserForm';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.dark,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends React.Component {
  state = {
    errorMsg: null,
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  onUpdate = (values) => {
    const {user} = this.props;
    values = omit(values, ['email']);

    this.props.axios.put(`/users/${user.id}`, values).then((response) => {
      this.props.setAccountInfo(response.data);
    }).catch(() => {
      this.setState({errorMsg: "Something went wrong updating. Please try again later"});
    });
  };

  getFooter = (submitting, invalid, dirty) => {
    return (
      <Grid container justify="flex-end">
        <Button
          type="submit"
          color="primary"
          disabled={!dirty}
        >
          Update
        </Button>
        <Button onClick={this.onCancel} color="primary">
          Cancel
        </Button>
      </Grid>
    );
  };

  render() {
    const {classes, user} = this.props;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline/>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Profile
            </Typography>
            <UserForm onSubmit={this.onUpdate} initialValues={user}
                      operation='update'
                      errorMsg={this.state.errorMsg}
                      footer={this.getFooter}/>
          </div>
        </Container>
      </div>
    )
  }
}

Login.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object,
  match: PropTypes.object,
  axios: PropTypes.func,
  setAccountInfo: PropTypes.func,
  classes: PropTypes.object,
};

const loginConnector = connect(null, {setAccountInfo});

export default flow(
  withRouter,
  withAxios,
  loginConnector,
  withStyles(styles)
)(Login);
