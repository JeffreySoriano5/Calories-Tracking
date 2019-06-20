import React from 'react';
import PropTypes from 'prop-types';
import flow from 'lodash/flow';
import {withRouter} from 'react-router-dom';
import {accountConnector} from 'common/utils';

class Home extends React.Component {
  render() {
    return (
      <div>Home page</div>
    );
  }
}


Home.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object,
  match: PropTypes.object,
};

export default flow(
  withRouter,
  accountConnector,
)(Home);
