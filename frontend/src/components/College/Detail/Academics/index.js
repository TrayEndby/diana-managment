import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Academics = ({ college }) => {
  const { facultyratio } = college;

  if (!facultyratio) {
    return null;
  }

  return (
    <DetailLayout title="Academics">
      {facultyratio && <DetailRow>Faculty ratio: {facultyratio}</DetailRow>}
    </DetailLayout>
  );
};

Academics.propTypes = propTypes;

export default Academics;
