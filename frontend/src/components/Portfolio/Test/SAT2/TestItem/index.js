import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Item } from '../../../Layout';

const propTypes = {
  test: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const TestItem = ({ test, onClick, onDelete }) => {
  const { takenDate, subject, score } = test;
  return (
    <Item
      onClick={onClick}
      onDelete={onDelete}
      style={{ width: 'fit-content' }}
    >
      <div className="mr-2">Date: {moment(takenDate).format('YYYY-MM')}</div>
      <div className="mr-2">Subject: {subject}</div>
      <div className="mr-2">Score: {score}</div>
    </Item>
  );
};

TestItem.propTypes = propTypes;

export default TestItem;
