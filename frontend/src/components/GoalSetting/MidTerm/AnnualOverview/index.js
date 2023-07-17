import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Markdown from '../../../Markdown';

import Picture from '../../../../util/Picture';
import * as ROUTES from '../../../../constants/routes';

import style from '../Overview/style.module.scss';

const propTypes = {
  grade: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.string.isRequired,
  picture_id: PropTypes.number.isRequired,
};

const getRedirectURL = (grade) => `${ROUTES.GOAL_MID_TERM_GRADE}/${grade}`;

const AnnualOverview = (props) => {
  const { grade } = props;
  return (
    <div
      className={classNames(style.grade, {
        [style.left]: grade === 9 || grade === 11,
        [style.right]: grade === 10 || grade === 12,
      })}
    >
      <Outline {...props} />
      <GradeLogo grade={grade} />
    </div>
  );
};

const GradeLogo = ({ grade }) => {
  const history = useHistory();
  return (
    <div className={style.logo} onClick={() => history.push(getRedirectURL(grade))}>
      <span>Grade</span>
      <b>{grade}th</b>
    </div>
  );
};

const Outline = ({ grade, title, items, picture_id }) => {
  return (
    <div className={style.outline}>
      <div className={style.info}>
        <h5>{title}</h5>
        <Markdown source={items} className="App-ul-list" />
        <Link to={getRedirectURL(grade)}>Learn more</Link>
      </div>
      <Picture id={picture_id} className={style.picture} />
    </div>
  );
};

AnnualOverview.propTypes = propTypes;

export default React.memo(AnnualOverview);
