import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {withAxios} from 'react-axios';
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {setAccountInfo} from 'common/redux/actions/auth'
import LoginForm from './components/Form';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.grey.white,
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
    loginError: null,
  };

  onLogin = (values) => {
    this.setState({loginError: false});

    this.props.axios.post('/auth/login', values).then((response) => {
      this.props.setAccountInfo(response.data);
      this.props.history.push('/');
    }).catch(({response}) => {
      let errorMsg = "Something went wrong signing in. Please try again later";

      if (response.status === 401) errorMsg = "Incorrect email or password";

      this.setState({loginError: errorMsg});
    });
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
              Sign in
            </Typography>
            <LoginForm onSubmit={this.onLogin} errorMsg={this.state.loginError}/>
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
};

const loginConnector = connect(null, {setAccountInfo});

export default flow(
  withRouter,
  withAxios,
  loginConnector,
  withStyles(styles)
)(Login);
