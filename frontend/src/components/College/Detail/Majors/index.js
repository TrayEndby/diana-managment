import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

import collegeService from '../../../../service/CollegeService';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const collegeMajors = collegeService.listMajors();

const Majors = ({ college }) => {
  let hasMajorValue = false;
  const majorValues = collegeMajors.map(({ key }) => {
    if (college[key]) {
      hasMajorValue = true;
    }
    return college[key];
  });

  if (!hasMajorValue) {
    return null;
  }

  return (
    <DetailLayout title="Major rankings">
      {majorValues.map((majorVal, index) => {
        if (!majorVal) {
          return null;
        } else {
          const { key, text } = collegeMajors[index];
          return <DetailRow key={key}>{`${text}: ${majorVal}`}</DetailRow>;
        }
      })}
    </DetailLayout>
  );
};

Majors.propTypes = propTypes;

export default Majors;
