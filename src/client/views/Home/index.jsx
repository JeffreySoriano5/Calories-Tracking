import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import isString from 'lodash/isString';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import {withRouter} from 'react-router-dom';
import DateFnsUtils from "@date-io/date-fns";
import {withStyles} from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {withAxios} from 'react-axios';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Chip from '@material-ui/core/Chip';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import Dialog from 'common/components/Dialog';
import {accountConnector, hasPermissions} from 'common/utils';
import MealForm from './component/Form';

const dateFns = new DateFnsUtils();

const styles = theme => ({
  viewAllBtn: {
    marginLeft: theme.spacing(1),
  },
  greenChip: {
    backgroundColor: "#8BC34A",
    color: theme.palette.common.white,
  },
  redChip: {
    backgroundColor: "#F44336",
    color: theme.palette.common.white,
  },
  chipIcon: {
    color: theme.palette.common.white,
  }
});

class Home extends React.Component {
  state = {
    isDeleting: false,
    isOpen: false,
    operation: '',
    actualMeal: null,
    handler: null,
    errorMsg: null,
    showAll: false,
    totalForDay: 0,
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
      const params = {
        page: query.page + 1,
        limit: query.pageSize,
        text: query.search,
      };

      if (this.state.showAll) params.all = true;

      this.props.axios.get('/meals', {params}).then(({data}) => {
        if (data.totalForDay) this.setState({totalForDay: data.totalForDay});

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

  onShowAllToggle = () => {
    this.setState({showAll: !this.state.showAll}, () => {
      this.tableRef.current.onQueryChange();
    });
  };

  getTitle = () => {
    const {user, classes} = this.props;

    if (hasPermissions(user, ['read_meal'])) {
      return <span>
        <span>Meals</span>
      <FormControlLabel className={classes.viewAllBtn}
                        control={
                          <Switch checked={this.state.showAll} color="primary" onChange={this.onShowAllToggle}
                                  value="showAll"/>
                        }
                        label="Show all users meals"
      />
      </span>;
    }

    return 'Meals';
  };

  getColumns = () => {
    const {user, classes} = this.props;

    //TODO: just take into account when on one day view
    const {totalForDay} = this.state;
    const isUnderLimit = (totalForDay < user.calories_per_day);
    const chipCls = (isUnderLimit) ? classes.greenChip : classes.redChip;

    const columns = [
      {title: "Meal", field: "text"},
      {
        title: "Calories",
        field: "calories_count",
        render: rowData => {
          const icon = isUnderLimit ? <ThumbUp className={classes.chipIcon}/> :
            <ThumbDown className={classes.chipIcon}/>;

          const props = {
            icon: icon,
            label: rowData.calories_count,
            className: chipCls,
          };


          return <Chip size='small' {...props}/>
        }
      },
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
    ];

    if (this.state.showAll) columns.push({
      title: 'User',
      field: 'user',
      render: rowData => {
        return `${rowData.user.first_name} ${rowData.user.last_name}`
      }
    });

    return columns;
  };

  _getId = (value) => {
    return isString(value) ? value : get(value, 'id', null);
  };

  render() {
    const {user} = this.props;
    const {operation, isOpen, actualMeal, handler, errorMsg, showAll, isDeleting} = this.state;

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
          title={this.getTitle()}
          tableRef={this.tableRef}
          columns={this.getColumns()}
          data={this.getMeals}
          actions={[
            {
              icon: 'add_circle',
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
            (rowData) => ({
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
              disabled: showAll && (this._getId(rowData.user) !== user.id) && !hasPermissions(user, ['update_meal']),
            }),
            (rowData) => ({
              icon: 'delete',
              tooltip: 'Delete Meal',
              onClick: (event, rowData) => {
                this.setState({isDeleting: true, actualMeal: rowData});
              },
              disabled: showAll && (this._getId(rowData.user) !== user.id) && !hasPermissions(user, ['delete_meal']),
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
  classes: PropTypes.object,
};

export default flow(
  withStyles(styles),
  withRouter,
  withAxios,
  accountConnector,
)(Home);
