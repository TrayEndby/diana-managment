import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';

export const DetailRow = ({ children }) => <Card.Text className="px-2">{children}</Card.Text>;

DetailRow.prototypes = {
  children: PropTypes.element.isRequired,
};

const DetailLayout = ({ title, children }) => (
  <div className="mb-3">
    <h5>{title}</h5>
    <Card className="py-3">{children}</Card>
  </div>
);

DetailLayout.prototypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default DetailLayout;
