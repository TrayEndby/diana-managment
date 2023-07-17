import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'util/helpers';

import style from './style.module.scss';

const propTypes = {
  personalAmount: PropTypes.number,
  downlineAmount: PropTypes.number,
  totalAmount: PropTypes.number
};

const MonthEarningSection = (props) => {
  const { personalAmount, downlineAmount, totalAmount } = props;
  return (<div className={style.monthEarning}>
    <div className={style.flexItem}>
      <div className={style.monthEarningLabel}>This month earnings</div>
    </div>
    <div className={style.monthEarningContent}>
      <div className={style.individualTab} style={{ width: '35%' }}>
        <div className={style.individualTabLabel}>Personal totals</div>
        <div className={style.individualTabContent}>${formatNumber(personalAmount)}</div>
      </div>
      <div className={style.splitter}></div>
      <div className={style.individualTab} style={{ width: '30%' }}>
        <div className={style.individualTabLabel}>Downline totals</div>
        <div className={style.individualTabContent}>${formatNumber(downlineAmount)}</div>
      </div>
      <div className={style.splitter}></div>
      <div className={style.individualTab} style={{ width: '35%' }}>
        <div className={style.individualTabLabel}>Total commission earned</div>
        <div className={style.individualTabContent}>${formatNumber(totalAmount)}</div>
      </div>
    </div>
  </div>
  )
};

MonthEarningSection.propTypes = propTypes;

export default MonthEarningSection;

