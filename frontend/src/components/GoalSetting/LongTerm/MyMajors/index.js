import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import MajorListView from '../MajorListView';
import Layout from '../../Layout';

const propTypes = {
  majors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  ),
  onClick: PropTypes.func.isRequired,
};

const MyMajors = ({ majors, onClick }) => {
  const topBar = (
    <>
      <Col></Col>
      <Col>
        <h5>Your major choice</h5>
      </Col>
      <Col>
        <Button onClick={onClick}>Choose again</Button>
      </Col>
    </>
  );

  return (
    <Layout customTopBar={topBar} listView>
      <MajorListView majors={majors} />
    </Layout>
  );
};

MyMajors.propTypes = propTypes;

export default MyMajors;
