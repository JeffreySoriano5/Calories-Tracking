import React from 'react';
import PropTypes from 'prop-types';
import {Form, Field} from 'react-final-form'
import flow from 'lodash/flow';
import validate from 'validate.js';
import {Link as RouterLink} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  passField: {
    margin: theme.spacing(1, 0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const required = value => {
  return (validate.isEmpty(value)) ? 'Required' : undefined;
};

const isEmail = value => {
  const error = validate({value}, {
    value: {email: true},
  });

  return (error) ? 'Must be a valid email' : undefined;
};

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

class LoginForm extends React.Component {
  render() {
    const {classes, onSubmit, errorMsg} = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        render={({handleSubmit, submitting, invalid}) => (
          <form onSubmit={handleSubmit} className={classes.form}>
            <Field name="email" validate={composeValidators(required, isEmail)}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={meta.error && meta.touched}
                  FormHelperTextProps={{error: meta.error && meta.touched}}
                  helperText={(meta.error && meta.touched) ? meta.error : ' '}
                />
              )}
            </Field>
            <Field name="password" validate={required}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  className={classes.passField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={meta.error && meta.touched}
                  FormHelperTextProps={{error: meta.error && meta.touched}}
                  helperText={(meta.error && meta.touched) ? meta.error : ' '}
                />
              )}
            </Field>
            <FormHelperText error>{errorMsg}</FormHelperText>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={submitting || invalid}
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" component={RouterLink} to='signUp'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
};

export default flow(
  withStyles(styles),
)(LoginForm);
