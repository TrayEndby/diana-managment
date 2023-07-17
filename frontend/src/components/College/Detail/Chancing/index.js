import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

import collegeService from '../../../../service/CollegeService';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Chancing = ({ college }) => {
  const { avgGPA, percentageAdmitted, percentageAdmittedandEnrolled, evaluation } = college;

  if (!avgGPA && !percentageAdmitted && !percentageAdmittedandEnrolled && !evaluation) {
    return null;
  }

  return (
    <DetailLayout title="Chancing">
      {avgGPA && <DetailRow>Average GPA: {avgGPA}</DetailRow>}
      {percentageAdmitted && (
        <DetailRow>
          Admitted Percentage: {collegeService.formatNumToPercentage(percentageAdmitted)}
        </DetailRow>
      )}
      {percentageAdmittedandEnrolled && (
        <DetailRow>
          Admitted and Enrolled Percentage: {collegeService.formatNumToPercentage(percentageAdmittedandEnrolled)}
        </DetailRow>
      )}
      {evaluation && <DetailRow>Admission difficulty: {evaluation}</DetailRow>}
    </DetailLayout>
  );
};

Chancing.propTypes = propTypes;

export default Chancing;
