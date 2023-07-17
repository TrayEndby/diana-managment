import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../../../Markdown';
import Picture from '../../../../util/Picture';
import style from '../AnnualPlan/style.module.scss';

const propTypes = {
  plans: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
}

const AnnualPlanRow = ({ plans, index }) => {
  const [goals, firstSemester, secondSemester] = plans;
  const [goal1, goal2] = goals;
  return (
    <div className={style.tr}>
      <div className={style.td}>
        <div className={style.hint}>{`Goal ${index + 1}`}</div>
        <Markdown source={goal1.value} />
        <Picture id={goal1.picture_id} className={style.picture} />
        {goal2 && <Markdown source={goal2.value} className="mt-2" />}
        <div className={style.divider}></div>
      </div>
      <div className={style.td}>
        <div className={style.hint}>First Semester</div>
        <Markdown source={firstSemester.value} />
        <div className={style.divider}></div>
      </div>
      <div className={style.td}>
        <div className={style.hint}>Second Semester</div>
        <Markdown source={secondSemester.value} />
        <div className={style.divider}></div>
      </div>
    </div>
  )
}

AnnualPlanRow.propTypes = propTypes;

export default React.memo(AnnualPlanRow);


