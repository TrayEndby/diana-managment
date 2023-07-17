import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Item } from '../../../Layout';

const propTypes = {
  sections: PropTypes.array.isRequired,
  test: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const getTakenDate = (test) => {
  for (let sectionTest of test) {
    if (sectionTest && sectionTest.takenDate) {
      return moment(sectionTest.takenDate);
    }
  }
};

const getIdToSectionMap = (test) => {
  const map = new Map();
  test.forEach((sectionTest) => {
    if (sectionTest) {
      map.set(sectionTest.test_id, sectionTest);
    }
  });
  return map;
};

const SATItem = ({ sections, test, onClick, onDelete }) => {
  const date = getTakenDate(test);
  const map = getIdToSectionMap(test);
  return (
    <Item onClick={onClick} onDelete={onDelete} style={{ width: 'fit-content' }}>
      <div className="mr-2">Date: {date.format('YYYY-MM')}</div>
      {sections.map(({ name, id }) => {
        const sectionTest = map.get(id);
        if (sectionTest && sectionTest.score) {
          return <div key={id} className="mr-2">{`${name}: ${sectionTest.score}`}</div>;
        } else {
          return null;
        }
      })}
    </Item>
  );
};

SATItem.propTypes = propTypes;

export default SATItem;
