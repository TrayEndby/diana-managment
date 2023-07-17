import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { X } from 'react-bootstrap-icons';
import Markdown from 'components/Markdown';
import astronaut from 'assets/svg/Astronaut.svg';

import styles from './style.module.scss';

const propTypes = {
  message: PropTypes.string,
};

const HelpPopUp = ({ message }) => {
  const [show, setShow] = useState(true);

  return (
    <div className={styles.container}>
      <img src={astronaut} alt="astronaut" onClick={() => setShow(!show)} />
      {show && (
        <div className={styles.messages}>
          <div className={styles.content}>
            <X className={cn(styles.close, 'App-clickable')} onClick={() => setShow(false)} />
            <Markdown source={message} />
          </div>
        </div>
      )}
    </div>
  );
};

HelpPopUp.propTypes = propTypes;

export default HelpPopUp;
