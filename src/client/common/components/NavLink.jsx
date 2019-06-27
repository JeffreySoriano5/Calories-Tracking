import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import React from 'react';
import {Link, Route} from 'react-router-dom';

/**
 * Base Link
 * @extends {Link}
 */
class BaseLink extends Link {

  render() {
    const {to, isActive, ...props} = this.props;
    const href = this.props.history.createHref(typeof to === 'string' ? {pathname: to} : to);
    if (isFunction(props.children)) {
      return props.children({
        ...props,
        onClick: (e) => this.handleClick.call(this, e, this.props.history),
        href,
        isActive,
      });
    }

    return <a
      {...props}
      onClick={(e) => this.handleClick.call(this, e, this.props.history)}
      href={href}
    />;
  }
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 * @return {XML}
 */
const NavLink = ({
                   to,
                   exact,
                   strict,
                   activeClassName,
                   className,
                   activeStyle,
                   style,
                   isActive: getIsActive,
                   ...rest
                 }) => (
  <Route
    path={typeof to === 'object' ? to.pathname : to}
    exact={exact}
    strict={strict}
  >
    {({location, history, match}) => {
      const isActive = !!(getIsActive ? getIsActive(match, location) : match);

      return (
        <BaseLink
          to={to}
          history={history}
          className={isActive ?
            [activeClassName, className].join(' ') :
            className}
          style={isActive ? {...style, ...activeStyle} : style}
          isActive={isActive}
          {...rest}
        />
      );
    }}
  </Route>
);

NavLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  activeStyle: PropTypes.object,
  style: PropTypes.object,
  isActive: PropTypes.func,
};

NavLink.defaultProps = {
  activeClassName: 'active',
};

export default NavLink;
