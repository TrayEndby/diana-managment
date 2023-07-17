import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';

const propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Section = ({ title, children }) => {
  return (
    <div>
      <div className="d-flex align-items-center">
        <Col>
          <h6 className="m-0 text-white">{title}:</h6>
        </Col>
      </div>
      {children}
    </div>
  );
};

Section.propTypes = propTypes;

export default Section;
