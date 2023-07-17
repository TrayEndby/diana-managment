import React from 'react';
import PropTypes from 'prop-types';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';

import * as tableStyle from '../Table/style.module.scss';

const propTypes = {
  onClick: PropTypes.func,
};

const DeatilIcon = ({ onClick }) => (
  <Col className={tableStyle.detailRow}>
    <BoxArrowUpRight size="24px" className={tableStyle.tableIcon} onClick={onClick} />
  </Col>
);

DeatilIcon.propTypes = propTypes;

export default DeatilIcon;
