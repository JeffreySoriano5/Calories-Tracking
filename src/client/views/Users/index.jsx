import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import MaterialTable from 'material-table';
import {withAxios} from 'react-axios';
import flow from 'lodash/flow';
import capitalize from 'lodash/capitalize';
import omit from 'lodash/omit';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from 'common/components/Dialog';
import {accountConnector, hasPermissions} from 'common/utils';
import UserModal from './component/Dialog';
import isString from 'lodash/isString';
import get from 'lodash/get';

class Users extends React.Component {
  state = {
    isDeleting: false,
    isOpen: false,
    operation: '',
    actualUser: null,
    handler: null,
    errorMsg: null,
  };

  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
  }

  onClose = () => {
    this.setState({isOpen: false});
  };

  onClosed = () => {
    this.setState({
      operation: '',
      actualUser: null,
      handler: null,
      errorMsg: null,
    });
  };

  getUsers = (query) => {
    return new Promise((resolve, reject) => {
      this.props.axios.get('/users', {
        params: {
          page: query.page + 1,
          limit: query.pageSize,
          name: query.search,
        }
      }).then(({data}) => {
        resolve({
          data: data.items,
          page: query.page,
          totalCount: data.total,
        });
      }).catch(({response}) => {
        reject(response);
      });
    });
  };

  onCreate = (values) => {
    values = omit(values, ['confirm_password']);
    this.props.axios.post('/users', values).then(() => {
      this.onClose();
      this.tableRef.current.onQueryChange();
    }).catch(({response}) => {
      let errorMsg = "Something went wrong signing in. Please try again later";

      if (response.status === 409) errorMsg = "Email is already in use.";

      this.setState({errorMsg});
    })
  };

  onUpdate = (values) => {
    values = omit(values, ['email']);

    this.props.axios.put(`/users/${this.state.actualUser.id}`, values).then(() => {
      this.onClose();
      this.tableRef.current.onQueryChange();
    }).catch(() => {
      this.setState({errorMsg: "Something went wrong updating. Please try again later"});
    });
  };

  onDelete = () => {
    this.props.axios.delete(`/users/${this.state.actualUser.id}`).then(() => {
      this.onDeleteClose();
      this.tableRef.current.onQueryChange();
    }).catch(() => {
      this.setState({errorMsg: "Something went wrong deleting. Please try again later"});
    });
  };

  _getId = (value) => {
    return isString(value) ? value : get(value, 'id', null);
  };

  render() {
    const {user} = this.props;
    const {operation, isOpen, actualUser, handler, errorMsg, isDeleting} = this.state;

    const deleteActions = [
      <Button onClick={this.onDeleteClose} key='cancel' color="primary">
        Cancel
      </Button>,
      < Button onClick={this.onDelete} key='delete' color="secondary">
        Delete
      </Button>
    ];

    return (
      <React.Fragment>
        <UserModal title={`${capitalize(operation)} User`}
                   initialValues={actualUser}
                   operation={operation}
                   submitText={operation}
                   onSubmit={handler}
                   open={isOpen}
                   onClose={this.onClose}
                   afterClosed={this.onClosed}
                   errorMsg={errorMsg}
        />
        <Dialog title='Delete user' open={isDeleting} onClose={this.onDeleteClose} actions={deleteActions}>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </Dialog>
        <MaterialTable
          title='Users'
          tableRef={this.tableRef}
          columns={[
            {title: "Name", field: "first_name", render: rowData => `${rowData.first_name} ${rowData.last_name}`},
            {title: "Email", field: "email"},
            {title: "Calores Per Day", field: "calories_per_day"},
            {title: "Role", field: "role"},
          ]}
          data={this.getUsers}
          actions={[
            {
              icon: 'add_circle',
              tooltip: 'Add User',
              isFreeAction: true,
              onClick: () => {
                this.setState({
                  operation: 'create',
                  isOpen: true,
                  actualUser: {date: new Date()},
                  handler: this.onCreate,
                })
              },
              disabled: !hasPermissions(user, ['create_user']),
            },
            (rowData) => ({
              icon: 'edit',
              tooltip: 'Edit User',
              onClick: (event, rowData) => {
                this.setState({
                  operation: 'update',
                  isOpen: true,
                  actualUser: rowData,
                  handler: this.onUpdate,
                })
              },
              disabled: (this._getId(rowData.id) !== user.id) && !hasPermissions(user, ['update_user']),
            }),
            (rowData) => ({
              icon: 'delete',
              tooltip: 'Delete User',
              onClick: (event, rowData) => {
                this.setState({isDeleting: true, actualUser: rowData});
              },
              disabled: (this._getId(rowData.id) !== user.id) && !hasPermissions(user, ['delete_user']),
            }),
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
            emptyRowsWhenPaging: false,
          }}
        />
      </React.Fragment>
    );
  }
}


Users.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object,
  match: PropTypes.object,
  axios: PropTypes.object,
};

export default flow(
  withRouter,
  withAxios,
  accountConnector,
)(Users);
