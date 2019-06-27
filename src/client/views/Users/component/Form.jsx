import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import pick from 'lodash/pick';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Field, Form} from 'react-final-form';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Dialog from 'common/components/Dialog';
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
  componentDidUpdate(prevProps, prevState, snapshot) { //eslint-disable-line
    const {open, afterClosed} = this.props;

    if (prevProps.open && !open && afterClosed) afterClosed();
  }

  render() {
    const {
      title, open, onClose, onSubmit, operation,
      initialValues, submitText, classes, errorMsg
    } = this.props;

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

    let emailFieldInputProps;

    if (operation === 'update') emailFieldInputProps = {readOnly: true, disabled: true};

    return (
      <Dialog title={title} open={open} onClose={onClose}>
        <Form
          onSubmit={onSubmit}
          initialValues={initValues}
          render={({handleSubmit, submitting, values, invalid, dirty}) => (
            <form onSubmit={handleSubmit} className={classes.form}>
              <Grid container justify='space-between' spacing={2}>
                <Grid item >
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
                <Grid item>
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
              </React.Fragment>}
              <FormHelperText error>{errorMsg}</FormHelperText>
              <Grid container justify="flex-end">
                <Button
                  type="submit"
                  color="primary"
                  disabled={(operation === 'create') ? (submitting || invalid) : (!dirty)}
                >
                  {submitText}
                </Button>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
              </Grid>
            </form>
          )}
        />
      </Dialog>
    );
  }
}


UserForm.propTypes = {
  title: PropTypes.string,
  open: PropTypes.boolean,
  onClose: PropTypes.func,
  afterClosed: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  submitText: PropTypes.string,
  classes: PropTypes.object,
  errorMsg: PropTypes.string,
};

export default flow(
  withStyles(styles)
)(UserForm);
