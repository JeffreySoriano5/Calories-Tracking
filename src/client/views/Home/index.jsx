import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import capitalize from 'lodash/capitalize';
import {withRouter} from 'react-router-dom';
import DateFnsUtils from "@date-io/date-fns";
import MaterialTable from 'material-table';
import {withAxios} from 'react-axios';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from 'common/components/Dialog';
import {accountConnector, hasPermissions} from 'common/utils';
import MealForm from './component/Form';

const dateFns = new DateFnsUtils();

class Home extends React.Component {
  state = {
    isDeleting: false,
    isOpen: false,
    operation: '',
    actualMeal: null,
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
      actualMeal: null,
      handler: null,
      errorMsg: null,
    });
  };

  getMeals = (query) => {
    return new Promise((resolve, reject) => {
      this.props.axios.get('/meals', {
        params: {
          page: query.page + 1,
          limit: query.pageSize,
          text: query.search,
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
    this.props.axios.post('/meals', values).then(() => {
      this.onClose();
      this.tableRef.current.onQueryChange();
    }).catch(() => {
      this.setState({errorMsg: "Something went wrong on creation. Please try again later"});
    })
  };

  onUpdate = (values) => {
    this.props.axios.put(`/meals/${this.state.actualMeal.id}`, values).then(() => {
      this.onClose();
      this.tableRef.current.onQueryChange();
    }).catch(() => {
      this.setState({errorMsg: "Something went wrong updating. Please try again later"});
    });
  };

  onDelete = () => {
    this.props.axios.delete(`/meals/${this.state.actualMeal.id}`).then(() => {
      this.onDeleteClose();
      this.tableRef.current.onQueryChange();
    }).catch(() => {
      this.setState({errorMsg: "Something went wrong deleting. Please try again later"});
    });
  };

  onDeleteClose = () => {
    this.setState({isDeleting: false, actualMeal: null})
  };

  render() {
    const {user} = this.props;
    const {operation, isOpen, actualMeal, handler, errorMsg, isDeleting} = this.state;

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
        <MealForm title={`${capitalize(operation)} Meal`}
                  initialValues={actualMeal}
                  operation={operation}
                  submitText={operation}
                  onSubmit={handler}
                  open={isOpen}
                  onClose={this.onClose}
                  afterClosed={this.onClosed}
                  errorMsg={errorMsg}
        />
        <Dialog title='Delete meal' open={isDeleting} onClose={this.onDeleteClose} actions={deleteActions}>
          <DialogContentText>
            Are you sure you want to delete this meal?
          </DialogContentText>
        </Dialog>
        <MaterialTable
          title='Meals'
          tableRef={this.tableRef}
          columns={[
            {title: "Meal", field: "text"},
            {title: "Calories", field: "calories_count"},
            {
              title: "Date",
              field: "formatted_date",
              render: rowData => {
                const initialDate = dateFns.date(rowData.date);
                return dateFns.format(initialDate, "MM/dd/yyyy")
              }
            },
            {
              title: "Time", field: "formatted_time", render: rowData => {
                const initialDate = dateFns.date(rowData.date);
                return dateFns.format(initialDate, "hh:mm a")
              }
            },
          ]}
          data={this.getMeals}
          actions={[
            {
              icon: 'add',
              tooltip: 'Add Meal',
              isFreeAction: true,
              onClick: () => {
                this.setState({
                  operation: 'create',
                  isOpen: true,
                  actualMeal: {date: new Date()},
                  handler: this.onCreate,
                })
              }
            },
            () => ({
              icon: 'edit',
              tooltip: 'Edit Meal',
              onClick: (event, rowData) => {
                this.setState({
                  operation: 'update',
                  isOpen: true,
                  actualMeal: rowData,
                  handler: this.onUpdate,
                })
              },
              disabled: !hasPermissions(user, ['update_meal']),
            }),
            () => ({
              icon: 'delete',
              tooltip: 'Delete Meal',
              onClick: (event, rowData) => {
                this.setState({isDeleting: true, actualMeal: rowData});
              },
              disabled: !hasPermissions(user, ['delete_meal']),
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


Home.propTypes = {
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
)(Home);
