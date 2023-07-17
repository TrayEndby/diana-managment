import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Col from 'react-bootstrap/Col';

import * as tableStyle from '../Table/style.module.scss';

const propTypes = {
  children: PropTypes.any,
};

const DetailHead = ({ children }) => (
  <Col className={classNames(tableStyle.theadTh, tableStyle.detailRow)}>{children}</Col>
);

DetailHead.propTypes = propTypes;

export default DetailHead;
