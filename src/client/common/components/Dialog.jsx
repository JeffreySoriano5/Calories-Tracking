import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class MyDialog extends React.Component {
  render() {
    const {title, open, onClose, actions} = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth='sm'
        open={open}
        onClose={onClose}
      >
        <DialogTitle id="max-width-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {this.props.children}
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );
  }
}

MyDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.boolean,
  onClose: PropTypes.func,
  actions: PropTypes.any,
  children: PropTypes.any,
};

export default MyDialog;
