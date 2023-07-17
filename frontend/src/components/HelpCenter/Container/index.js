import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { X } from 'react-bootstrap-icons';
import astronaut from 'assets/svg/Astronaut_no_flag.svg';

import styles from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
  initialOn: PropTypes.bool,
  renderHide: PropTypes.func,
};

const HelpContainer = ({ className, children, initialOn, renderHide }) => {
  const [show, setShow] = useState(initialOn || false);

  return (
    <div className={cn(styles.container, className)}>
      <img src={astronaut} alt="astronaut" onClick={() => setShow(!show)} />
      {show && (
        <div className="wrapper">
          <div className="content">
            <X
              className={cn('close', 'App-clickable')}
              onClick={() => setShow(false)}
            />
            {children}
          </div>
        </div>
      )}
      {!show && renderHide != null && renderHide()}
    </div>
  );
};

HelpContainer.propTypes = propTypes;

export default HelpContainer;
