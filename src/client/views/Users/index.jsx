import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import {withRouter} from 'react-router-dom';
import MaterialTable from 'material-table';
import {withAxios} from 'react-axios';
import {accountConnector} from 'common/utils';

class Users extends React.Component {

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

  render() {
    return (
      <MaterialTable
        columns={[
          {title: "Name", field: "first_name", render: rowData => `${rowData.first_name} ${rowData.last_name}`},
          {title: "Calores Per Day", field: "calories_per_day"},
          {title: "Role", field: "role"},
        ]}
        data={this.getUsers}
      />
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
