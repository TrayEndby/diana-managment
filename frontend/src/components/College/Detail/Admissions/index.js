import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

import collegeService from '../../../../service/CollegeService';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Admissions = ({ college }) => {
  const {
    totalApplicants,
    totalEnrollment,
    totalUGEnrollment,
    percentageOfOutOfState,
    percentageOfInState,
    percentageOfInternational,
  } = college;

  if (
    !totalApplicants &&
    !totalEnrollment &&
    !totalUGEnrollment &&
    !percentageOfOutOfState &&
    !percentageOfInState &&
    !percentageOfInternational
  ) {
    return null;
  }

  return (
    <DetailLayout title="Admission statistics">
      {totalApplicants && <DetailRow>Total applicats: {totalApplicants.toLocaleString()}</DetailRow>}
      {totalEnrollment && <DetailRow>Total enrollment: {totalEnrollment.toLocaleString()}</DetailRow>}
      {totalUGEnrollment && <DetailRow>Total undergraduate enrollment: {totalUGEnrollment.toLocaleString()}</DetailRow>}
      {percentageOfInState && (
        <DetailRow>
          Percentage of in state: {collegeService.formatNumToPercentage(percentageOfInState)}
        </DetailRow>
      )}
      {percentageOfOutOfState && (
        <DetailRow>
          Percentage of out of state: {collegeService.formatNumToPercentage(percentageOfOutOfState)}
        </DetailRow>
      )}
      {percentageOfInternational && (
        <DetailRow>
          Percentage of international: {collegeService.formatNumToPercentage(percentageOfInternational)}
        </DetailRow>
      )}
    </DetailLayout>
  );
};

Admissions.propTypes = propTypes;

export default Admissions;
