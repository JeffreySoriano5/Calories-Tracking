import React from 'react';
import PropTypes from 'prop-types';
import {Form, Field} from 'react-final-form'
import flow from 'lodash/flow';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import {validators, composeValidators} from 'common/utils';

const styles = theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  field: {
    margin: theme.spacing(1, 0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignUpForm extends React.Component {
  render() {
    const {classes, onSubmit, errorMsg} = this.props;

    const nameValidator = composeValidators(
      validators.isRequired,
      validators.maxLength(50),
      validators.minLength(2),
    );

    const caloriesValidator = composeValidators(
      validators.isRequired,
      validators.isNumber,
      validators.maxValue(50000)
    );

    return (
      <Form
        onSubmit={onSubmit}
        render={({handleSubmit, values, submitting, invalid}) => (
          <form onSubmit={handleSubmit} className={classes.form}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Field name="first_name" validate={nameValidator}>
                  {({input, meta}) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      variant="outlined"
                      margin="normal"
                      id="first_name"
                      label="First Name"
                      name="first_name"
                      error={meta.error && meta.touched}
                      FormHelperTextProps={{error: meta.error && meta.touched}}
                      helperText={(meta.error && meta.touched) ? meta.error : ' '}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field name="last_name" validate={nameValidator}>
                  {({input, meta}) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      variant="outlined"
                      margin="normal"
                      id="last_name"
                      label="Last Name"
                      name="last_name"
                      error={meta.error && meta.touched}
                      FormHelperTextProps={{error: meta.error && meta.touched}}
                      helperText={(meta.error && meta.touched) ? meta.error : ' '}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
            <Field name="email" validate={composeValidators(validators.isRequired, validators.isEmail)}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  className={classes.field}
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
            <Field name="calories_per_day" validate={caloriesValidator}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  className={classes.field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="calories_per_day"
                  label="Target Calories Per Day"
                  name="calories_per_day"
                  type="number"
                  error={meta.error && meta.touched}
                  FormHelperTextProps={{error: meta.error && meta.touched}}
                  helperText={(meta.error && meta.touched) ? meta.error : ' '}
                />
              )}
            </Field>
            <Field name="password" validate={validators.isRequired}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  className={classes.field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={meta.error && meta.touched}
                  FormHelperTextProps={{error: meta.error && meta.touched}}
                  helperText={(meta.error && meta.touched) ? meta.error : ' '}
                />
              )}
            </Field>
            <Field name="confirm_password" validate={composeValidators(
              validators.isRequired,
              validators.isEqual(values.password, 'Password'),
            )}>
              {({input, meta}) => (
                <TextField
                  {...input}
                  className={classes.field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  id="confirm_password"
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
              Sign Up
            </Button>
          </form>
        )}
      />
    );
  }
}

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
  classes: PropTypes.classes,
};

export default flow(
  withStyles(styles),
)(SignUpForm);
