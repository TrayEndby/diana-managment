import React from 'react';
import PropTypes from 'prop-types';

import { Item } from '../../Layout';
import { getHoursPerWeek, parseDateToString } from '../util';

const propTypes = {
  ECA: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ECAItem = ({ ECA, name, category, onClick, onDelete }) => {
  const { role, avgMinutesPerEvent, beginDate, endDate } = ECA;
  const hours = getHoursPerWeek(avgMinutesPerEvent);
  return (
    <Item style={{ width: '400px' }} onClick={onClick} onDelete={onDelete}>
      <div className="mr-2">Program: {name}</div>
      {category && <div className="mr-2">Category: {category}</div>}
      {beginDate && <div className="mr-2">Start date: {parseDateToString(beginDate)}</div>}
      {endDate && <div className="mr-2">End date: {parseDateToString(endDate)}</div>}
      {hours !== '' && <div className="mr-2">Hours per week: {hours}</div>}
      {role && <div className="mr-2">Position: {role}</div>}
    </Item>
  );
};

ECAItem.propTypes = propTypes;

export default ECAItem;
