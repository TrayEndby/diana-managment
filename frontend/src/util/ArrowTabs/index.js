import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import classNames from 'classnames';

import { getPathWithSearchParam } from '../../util/helpers';
import style from './style.module.scss';

const propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    }).isRequired,
  ).isRequired,
  className: PropTypes.string,
  tabStyle: PropTypes.object,
  keepSearchParam: PropTypes.bool,
};

const ArrowTabs = ({ history, location, tabs, className, tabStyle, keepSearchParam, strongPathCheck }) => {
  const typeOfCheck = (path) => strongPathCheck ? `${location.pathname}${location.search}` === path : (`${location.pathname}${location.search}`).includes(path);
  return (
    <div className={classNames(style.tabs, className)}>
      <ul className="flex-wrap">
        {tabs.map(({ path, name, disabled }, index) => (
          <li key={index} className="mt-2" style={{ whiteSpace: 'noWrap' }}>
            <Link
              to={keepSearchParam ? getPathWithSearchParam(path, history) : path}
              style={tabStyle}
              className={classNames({
                [style.active]: !disabled && typeOfCheck(path),
                [style.disabled]: disabled,
              })}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

ArrowTabs.propTypes = propTypes;

export default React.memo(withRouter(ArrowTabs));
