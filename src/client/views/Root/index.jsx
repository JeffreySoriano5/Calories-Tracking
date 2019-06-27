import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import axios from 'axios';
import {AxiosProvider} from 'react-axios';
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

    this.axios = axios.create({
      baseURL: '/api/',
      timeout: 2000,
    });
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
        <AxiosProvider instance={this.axios}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Router>
              <Route path="/" component={App}/>
            </Router>
          </MuiPickersUtilsProvider>
        </AxiosProvider>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;

