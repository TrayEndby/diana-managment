import React from 'react';
import PropTypes from 'prop-types';

import DetailLayout, { DetailRow } from '../Layout';

const propTypes = {
  college: PropTypes.object.isRequired,
};

const Aid = ({ college }) => {
  if (!college.FederalStudentLoansBeginningUndergratudates) {
    return null;
  }
  const {
    AverageAmountofAidreceived,
    NumberReceivingAid,
    PercentReceivingAid,
    TotalAmountOfAidReceived,
  } = college.FederalStudentLoansBeginningUndergratudates;

  if (!AverageAmountofAidreceived && !NumberReceivingAid && !PercentReceivingAid && !TotalAmountOfAidReceived) {
    return null;
  }

  return (
    <DetailLayout title="Financial Aid">
      {AverageAmountofAidreceived && (
        <DetailRow>Average Amount of Aid received: ${AverageAmountofAidreceived.toLocaleString()}</DetailRow>
      )}
      {NumberReceivingAid && <DetailRow>Number Receiving Aid: {NumberReceivingAid.toLocaleString()}</DetailRow>}
      {PercentReceivingAid && <DetailRow>Percent Receiving Aid: {PercentReceivingAid.toLocaleString()}%</DetailRow>}
      {TotalAmountOfAidReceived && <DetailRow>Total Amount Of Aid Received: ${TotalAmountOfAidReceived.toLocaleString()}</DetailRow>}
    </DetailLayout>
  );
};

Aid.propTypes = propTypes;

export default Aid;
