import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import Tooltip from 'util/Tooltip';
import styles from './style.module.scss';

const propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

const MenuCard = ({ icon, text, description, path }) => {
  const history = useHistory();
  return (
    <Tooltip title={description}>
      <div className={styles.card} onClick={() => history.push(path)}>
        <div className={styles.image}>
          <img src={icon} alt={text} />
        </div>
        <div className={styles.text}>
          {text}
        </div>
      </div>
    </Tooltip>
  )
};

MenuCard.propTypes = propTypes;

export default MenuCard;