import React from 'react';
import PropTypes from 'prop-types';

import personalWebsiteService from 'service/CSA/PersonalizedWebsiteService';
import style from './style.module.scss';

const propTypes = {
  data: PropTypes.object,
};

const InformationSection = (props) => {
  const upline = props.data;
  if (!upline) {
    return null;
  }
  return (
    <div className={style.informationSection}>
      <div className={style.cardTitle}>My upline CSA's information</div>
      <div className={style.flexItem}>
        <div className={style.keyText}>Email:</div>
        <div className={style.valueText}>{upline.email}</div>
      </div>
      <div className={style.flexItem}>
        <div className={style.keyText}>Kyros website:</div>
        <div className={style.valueText}>
          {personalWebsiteService.getWebsiteURL(upline.website)}
        </div>
      </div>
    </div>
  );
};

InformationSection.propTypes = propTypes;

export default InformationSection;
