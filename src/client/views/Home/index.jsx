import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import {withRouter} from 'react-router-dom';
import MaterialTable from 'material-table';
import {withAxios} from 'react-axios';
import {accountConnector} from 'common/utils';

class Home extends React.Component {

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
          data: data.items,// your data array
          page: query.page,// current page number
          totalCount: data.total, // total page number
        });
      }).catch(({response}) => {
        reject(response.data);
      });

    });
  };

  render() {
    return (
      <MaterialTable
        columns={[
          {title: "Meal", field: "text"},
          {title: "Calories", field: "calories_count"},
          {title: "Date", field: "formatted_date"},
          {title: "Time", field: "formatted_time"},
        ]}
        data={this.getMeals}
      />
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
