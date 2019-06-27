import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import pick from 'lodash/pick';
import {Field, Form} from 'react-final-form';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import {validators, composeValidators, numberIsEqual} from 'common/utils';

const styles = theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  field: {
    margin: theme.spacing(1, 0),
  },
  passField: {
    margin: theme.spacing(1, 0),
  },
});

class UserForm extends React.Component {
  render() {
    const {onSubmit, operation, initialValues, classes, errorMsg} = this.props;

    const initValues = pick(initialValues, ['first_name', 'last_name', 'email', 'calories_per_day']);

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

    const passwordValidator = composeValidators(
      validators.isRequired,
      validators.minLength(8),
      validators.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, 'Must contain a lowercase letter, 1 uppercase letter and 1 number'),
      validators.maxLength(40),
    );

    let emailFieldInputProps;

    if (operation === 'update') emailFieldInputProps = {readOnly: true, disabled: true};

    return (
      <Form
        onSubmit={onSubmit}
        initialValues={initValues}
        render={({handleSubmit, submitting, values, invalid, dirty}) => (
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
                  inputProps={emailFieldInputProps}
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
            <Field name="calories_per_day" validate={caloriesValidator} isEqual={numberIsEqual}>
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
            {operation === 'create' && <React.Fragment>
              <Field name="password" validate={passwordValidator}>
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
                passwordValidator,
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
            </React.Fragment>}
            <FormHelperText error>{errorMsg}</FormHelperText>
            {this.props.footer(submitting, invalid, dirty)}
          </form>
        )}
      />
    );
  }
}


UserForm.propTypes = {
  afterClosed: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  classes: PropTypes.object,
  footer: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
};

UserForm.defaultProps = {
  operation: 'create',
};

export default flow(
  withStyles(styles)
)(UserForm);
