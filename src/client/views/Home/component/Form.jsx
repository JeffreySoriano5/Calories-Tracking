import React from 'react';
import PropTypes from 'prop-types';
import DateFnsUtils from "@date-io/date-fns";
import flow from 'lodash/flow';
import pick from 'lodash/pick';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Field, Form} from 'react-final-form';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import Dialog from 'common/components/Dialog';
import {validators, composeValidators, numberIsEqual} from 'common/utils';

const styles = theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  passField: {
    margin: theme.spacing(1, 0),
  },
});

class MealForm extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) { //eslint-disable-line
    const {open, afterClosed} = this.props;

    if (prevProps.open && !open && afterClosed) afterClosed();
  }

  render() {
    const {
      title, open, onClose, onSubmit, operation,
      initialValues, submitText, classes, errorMsg
    } = this.props;

    const initValues = pick(initialValues, ['text', 'date', 'calories_count']);

    const caloriesValidator = composeValidators(
      validators.isRequired,
      validators.isNumber,
      validators.maxValue(50000)
    );

    return (
      <Dialog title={title} open={open} onClose={onClose}>
        <Form
          onSubmit={onSubmit}
          initialValues={initValues}
          render={({handleSubmit, submitting, invalid, dirty}) => (
            <form onSubmit={handleSubmit} className={classes.form}>
              <Field name="text" validate={validators.isRequired}>
                {({input, meta}) => (
                  <TextField
                    {...input}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="text"
                    label="Meal"
                    name="text"
                    error={meta.error && meta.touched}
                    FormHelperTextProps={{error: meta.error && meta.touched}}
                    helperText={(meta.error && meta.touched) ? meta.error : ' '}
                  />
                )}
              </Field>
              <Field name="calories_count" validate={caloriesValidator} isEqual={numberIsEqual}>
                {({input, meta}) => (
                  <TextField
                    {...input}
                    className={classes.field}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="calories_count"
                    label="Calories"
                    name="calories_count"
                    type="number"
                    error={meta.error && meta.touched}
                    FormHelperTextProps={{error: meta.error && meta.touched}}
                    helperText={(meta.error && meta.touched) ? meta.error : ' '}
                  />
                )}
              </Field>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Field name="date">
                  {({input}) => (
                    <KeyboardDateTimePicker
                      inputVariant="outlined"
                      variant="outlined"
                      label="Date"
                      margin="normal"
                      format="MM/dd/yyyy hh:mm a"
                      {...input} />
                  )}
                </Field>
              </MuiPickersUtilsProvider>
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


MealForm.propTypes = {
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
)(MealForm);
