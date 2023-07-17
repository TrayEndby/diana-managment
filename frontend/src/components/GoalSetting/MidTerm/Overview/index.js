import React from 'react';
import PropTypes from 'prop-types';

import AnnualOverview from '../AnnualOverview';
import Markdown from '../../../Markdown';

import style from './style.module.scss';

const propTypes = {
  overviews: PropTypes.array.isRequired,
};

const getIntrosAndGradesOverview = (overviews) => {
  const intros = [];
  const grades = [];
  overviews.forEach((item) => (item.type === 1 ? intros.push(item) : grades.push(item)));

  return {
    intros,
    grades,
  };
};

const Overview = ({ overviews }) => {
  const { intros, grades } = getIntrosAndGradesOverview(overviews);
  return (
    <div className={style.overview}>
      <div className={style.intros}>
        {intros[0].item.map(({ value }, index) => {
          if (index === 2) {
            const quotes = value.split('\n');
            return (
              <div key={index} className={style[`intro-${index}`]}>
                <div className={style.quote}>{quotes[0]}</div>
                <div className={style.name}>~ {quotes[2]}</div>
              </div>
            );
          } else {
            return <Markdown key={index} className={style[`intro-${index}`]} source={value} />;
          }
        })}
      </div>
      <div className={style.grades}>
        {grades.map(({ grade, item }) => {
          const [title, summary] = item;
          return (
            <AnnualOverview
              key={grade}
              grade={grade}
              title={title.value}
              picture_id={title.picture_id}
              items={summary.value}
            />
          );
        })}
      </div>
    </div>
  );
};

Overview.propTypes = propTypes;

export default React.memo(Overview);
