import React from 'react';
import PropTypes from 'prop-types';

import { Item } from '../../../Layout';

const propTypes = {
  test: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const showLevel = (level) => {
  switch (Number(level)) {
    case 2:
      return 'Standard';
    case 1:
      return 'Honors';
    default:
      return '';
  }
};

const IBItem = ({ test, onClick, onDelete }) => {
  const { takenDate, subject, level, score } = test;
  return (
    <Item
      style={{ width: 'fit-content' }}
      onClick={(e) => {
        e.preventDefault();
        onClick(test);
      }}
      onDelete={onDelete}
    >
      <div className="mr-2">Year: {takenDate.split('-')[0]}</div>
      <div className="mr-2">Subject: {subject}</div>
      <div className="mr-2">Level: {showLevel(level)}</div>
      <div className="mr-2">Score: {score}</div>
    </Item>
  );
};

IBItem.propTypes = propTypes;

export default IBItem;
