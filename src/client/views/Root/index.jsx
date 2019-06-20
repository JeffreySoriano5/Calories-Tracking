import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Log from 'common/utils/log';
import App from './App';

class Root extends Component {
  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.parseQueryString(window.location);

    const cleanTrailSlash = window.location.pathname.replace(new RegExp('/$'), '');
    props.history.replace(cleanTrailSlash + window.location.search);
  }

  componentDidCatch(error, info) {
    Log.error(error, info);
  }

  /**
   * parse query string
   * @param {object} location
   */
  parseQueryString = (location) => {
    let query = {};

    if (!isEmpty(location.search)) {
      query = queryString.parse(location.search);
    }

    Object.assign(location, {query});
  };

  /**
   * Render component.
   */
  render() {
    const {store} = this.props;

    return (
      <Provider store={store}>
        <Router>
          <Route path="/" component={App}/>
        </Router>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;

