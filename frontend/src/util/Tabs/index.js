import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Row from 'react-bootstrap/Row';

import { getPathWithSearchParam } from 'util/helpers';
import styles from './style.module.scss';

const propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string.isRequired,
      render: PropTypes.func,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  className: PropTypes.string,
  keepSearchParam: PropTypes.bool,
};

const Tabs = ({ tabs, location, className, keepSearchParam }) => {
  const history = useHistory();
  return (
    <Row className={cn(styles.tabs, className)}>
      {tabs.map(({ name, path, disabled, render }, i) => (
        <div
          key={i}
          className={cn('tab', {
            active: `${location.pathname}${location.search}`.includes(path),
            disabled: disabled,
          })}
          title={name}
          onClick={() =>
            history.push(
              keepSearchParam ? getPathWithSearchParam(path, history) : path,
            )
          }
        >
          {render ? render() : name}
        </div>
      ))}
    </Row>
  );
};

Tabs.propTypes = propTypes;

export default React.memo(withRouter(Tabs));
