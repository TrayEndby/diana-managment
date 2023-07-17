import React from 'react';
import PropTypes from 'prop-types';

import SaveButton from '../../../../util/SaveButton';

const propTypes = {
  onClick: PropTypes.func.isRequired
};

const SaveChange = ({ onClick }) => (
  <SaveButton variant="primary" onClick={onClick} style={{ width: '130px' }}>
    Save changes
  </SaveButton>
);

SaveChange.propTypes = propTypes;

export default SaveChange;
