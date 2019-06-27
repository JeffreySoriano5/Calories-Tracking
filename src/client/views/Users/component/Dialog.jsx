import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from 'common/components/Dialog';
import UserForm from 'common/components/UserForm';
import Container from '@material-ui/core/Container';

class UserDialog extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) { //eslint-disable-line
    const {open, afterClosed} = this.props;

    if (prevProps.open && !open && afterClosed) afterClosed();
  }

  getFooter = (submitting, invalid, dirty) => {
    const {onClose, operation, submitText} = this.props;

    return (
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
    );
  };

  render() {
    const {
      title, open, onClose, onSubmit, operation,
      initialValues, errorMsg
    } = this.props;

    return (
      <Dialog title={title} open={open} onClose={onClose}>
        <Container component="main" maxWidth="sm">
          <UserForm onSubmit={onSubmit}
                    initialValues={initialValues}
                    operation={operation}
                    errorMsg={errorMsg}
                    footer={this.getFooter}/>
        </Container>
      </Dialog>
    );
  }
}

UserDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  afterClosed: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  operation: PropTypes.string,
  submitText: PropTypes.string,
  errorMsg: PropTypes.string,
};

export default UserDialog;
