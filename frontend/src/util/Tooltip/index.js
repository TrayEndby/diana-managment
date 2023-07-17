import React from 'react';
import PropTypes from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const propTypes = {
  title: PropTypes.string.isRequired,
  placement: PropTypes.string,
  children: PropTypes.any.isRequired,
};

const CustomTooltip = ({ title, placement, children }) => {
  if (!title) {
    return <>{children}</>
  }
  const renderTooltip = (props) => <Tooltip {...props}>{title}</Tooltip>;

  return (
    <OverlayTrigger placement={placement || 'auto'} delay={{ show: 500, hide: 400 }} overlay={renderTooltip}>
      {children}
    </OverlayTrigger>
  );
};

CustomTooltip.propTypes = propTypes;

export default CustomTooltip;
