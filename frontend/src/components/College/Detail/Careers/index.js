import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Careers = ({ college }) => {
  const { salaryAfter10Years } = college;

  if (!salaryAfter10Years) {
    return null;
  }

  return (
    <DetailLayout title="Careers">
      {salaryAfter10Years && (
        <DetailRow>{`Salary After 10 years: $${salaryAfter10Years.toLocaleString()}/yr`}</DetailRow>
      )}
    </DetailLayout>
  );
};

Careers.propTypes = propTypes;

export default Careers;
