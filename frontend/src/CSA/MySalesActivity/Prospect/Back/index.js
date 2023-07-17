import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import BackButton from 'util/BackButton';

const propTypes = {
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

const Back = ({ text, path }) => {
  const history = useHistory();
  return (
    <BackButton
      className="mb-1"
      onClick={() => history.push(path)}
    >
      {text}
    </BackButton>
  );
};

Back.propTypes = propTypes;

export default Back;
