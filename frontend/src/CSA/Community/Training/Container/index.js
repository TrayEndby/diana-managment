import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CSABodyContainer from '../../../Container';
import * as CSA_ROUTES from 'constants/CSA/routes';

import style from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const TrainingContainer = ({ children, selectedTab }) => {
  let colors = ['black', 'black', 'black'];
  let backgroundcolors = ['grey', 'grey', 'grey'];
  colors[selectedTab] = 'green';
  backgroundcolors[selectedTab] = 'lightgrey';
  return (
    <CSABodyContainer title="Training / Certificate">
      <div className={style.title}>
        <div style={{ width: '33%', paddingTop: '5px' }}>
          <Link style={{ color: colors[0] }} to={CSA_ROUTES.TRAINING_VIDEO}>
            Training Videos
          </Link>
        </div>
        <div style={{ width: '33%', paddingTop: '5px' }}>
          <Link style={{ color: colors[1] }} to={CSA_ROUTES.SALES_DECKS}>
            Google Slides
          </Link>
        </div>
        <div style={{ width: '33%', paddingTop: '5px' }}>
          <Link style={{ color: colors[2] }} to={CSA_ROUTES.TRAINING_WEBINARS}>
            Training Webinars
          </Link>
        </div>
      </div>
      {children}
    </CSABodyContainer>
  );
};

TrainingContainer.propTypes = propTypes;

export default TrainingContainer;
