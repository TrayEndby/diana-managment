import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Arrow1 from '../../../../assets/annualPlan/Arrow1.png';
import Arrow2 from '../../../../assets/annualPlan/Arrow2.png';

import Markdown from '../../../Markdown';
import AnnualPlanRow from '../AnnualPlanRow';

import { splitPlan } from './util';
import style from './style.module.scss';

const propTypes = {
  onFetch: PropTypes.func.isRequired,
};

const AnnualPlan = ({ match, onFetch }) => {
  const [abstract, setAbstract] = useState(null);
  const [items, setItems] = useState(null);
  const id = match.params.id;

  useEffect(() => {
    onFetch(id)
    .then((res) => {
      const splittedRes = splitPlan(res);
      setAbstract(splittedRes.abstract)
      setItems(splittedRes.items);
    })
  }, [id, onFetch]);

  if (abstract == null || items == null) {
    return null;
  }

  return (
    <div className={style.plan}>
      <header>{`${id}th Grade`}</header>
      <div className={style.content}>
        <Markdown source={abstract} className={style.abstract} />
        <div className={style.table}>
          <div className={style.tHead}>
            <span>Goals</span>
            <img src={Arrow1} alt="Arrow1"/>
            <span>First Semester</span>
            <img src={Arrow2} alt="Arrow2" />
            <span>Second Semester</span>
          </div>
          <div className={style.tbody}>
            {items.map((plans, index) => (
              <AnnualPlanRow key={index} plans={plans} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

AnnualPlan.propTypes = propTypes;

export default React.memo(withRouter(AnnualPlan));
