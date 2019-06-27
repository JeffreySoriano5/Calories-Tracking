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
import {setSignUpInfo} from 'common/redux/actions/auth'
import UserForm from 'common/components/UserForm';

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
    signupError: null,
  };

  onSignUp = (values) => {
    this.props.axios.post('/auth/signup', omit(values, 'confirm_password')).then((response) => {
      this.props.setSignUpInfo(response.data.email);
      this.props.history.push('/login');
    }).catch(({response}) => {
      let errorMsg = "Something went wrong signing in. Please try again later";

      if (response.status === 409) errorMsg = "Email is already in use.";

      this.setState({signupError: errorMsg});
    });
  };

  getFooter = (submitting, invalid) => {
    const {classes} = this.props;

    return (
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={submitting || invalid}
        className={classes.submit}
      >
        Sign Up
      </Button>
    );
  };

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline/>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <UserForm onSubmit={this.onSignUp} errorMsg={this.state.signupError} footer={this.getFooter}/>
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
  axios: PropTypes.object,
  setSignUpInfo: PropTypes.func,
  classes: PropTypes.object,
};

const loginConnector = connect(null, {setSignUpInfo});

export default flow(
  withRouter,
  withAxios,
  loginConnector,
  withStyles(styles)
)(Login);
