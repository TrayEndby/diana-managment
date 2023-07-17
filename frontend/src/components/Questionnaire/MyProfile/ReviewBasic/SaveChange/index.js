import React from 'react';
import PropTypes from 'prop-types';

import SaveButton from '../../../../../util/SaveButton';

const propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const SaveChange = ({ text, onClick }) => (
  <div className="text-center w-100">
    <SaveButton
      variant="primary"
      onClick={onClick}
      className="font-weight-bold mt-4 mb-4"
    >
      {text || 'Save changes'}
    </SaveButton>
  </div>
);

SaveChange.propTypes = propTypes;

export default React.memo(SaveChange);
