import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Cost = ({ college }) => {
  const { inStateTuition, outStateTuition, averagePrice } = college;

  if (!inStateTuition && !outStateTuition && !averagePrice) {
    return null;
  }
  return (
    <DetailLayout title="Cost">
      {inStateTuition && <DetailRow>In state tuition: ${inStateTuition.toLocaleString()}/yr</DetailRow>}
      {outStateTuition && <DetailRow>Out state tuition: ${outStateTuition.toLocaleString()}/yr</DetailRow>}
      {averagePrice && <DetailRow>Average cost: ${averagePrice.toLocaleString()}/yr</DetailRow>}
    </DetailLayout>
  );
};

Cost.propTypes = propTypes;

export default Cost;
