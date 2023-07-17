import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.module.scss';

const propTypes = {
  children: PropTypes.any.isRequired,
  section: PropTypes.number.isRequired,
  instr: PropTypes.string,
};

const sectionTitles = {
  // 1: 'Section 1: Basic information',
  2: 'Section 1: Academic ability and extracurriculars',
  3: 'Section 2: Supplementary information',
};

const LeftCard = React.memo(({ section, instr, children, redirect }) => (
  <div className={style.leftCard}>
    <header className="text-center">{sectionTitles[section]}</header>
    <div className={style.content}>
      <h1>{children}</h1>
      {instr && <p>{instr}</p>}
    </div>
  </div>
));

LeftCard.propTypes = propTypes;

export default LeftCard;
