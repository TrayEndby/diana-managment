import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DetailLayout from '../Layout';
import Dropdown from 'react-bootstrap/Dropdown';

const propTypes = {
  college: PropTypes.object.isRequired,
  sportsList: PropTypes.array.isRequired,
};

const Sports = ({ college, sportsList }) => {
  let { MenSports, WomenSports } = college;
  MenSports = MenSports || [];
  WomenSports = WomenSports || [];
  let hasMenSports = false;
  let hasWomenSports = false;
  sportsList.forEach(({ id }) => {
    const index = id - 1;
    if (MenSports[index]) {
      hasMenSports = true;
    }

    if (WomenSports[index]) {
      hasWomenSports = true;
    }
  });

  if (!hasMenSports && !hasWomenSports) {
    return null;
  }
  return (
    <DetailLayout title="Sports">
      <Row className="px-4">
        <Col></Col>
        <Col as="h5">Men Sports</Col>
        <Col as="h5">Women Sports</Col>
      </Row>
      {sportsList.map(({ id, name }) => {
        const index = id - 1;
        const menSport = MenSports[index] || '';
        const womenSport = WomenSports[index] || '';
        if (!menSport && !womenSport) {
          return null;
        }
        return (
          <React.Fragment key={id}>
            <Dropdown.Divider />
            <Row className="px-4">
              <Col>{name}</Col>
              <Col>{menSport}</Col>
              <Col>{womenSport}</Col>
            </Row>
          </React.Fragment>
        );
      })}
    </DetailLayout>
  );
};

Sports.propTypes = propTypes;

export default Sports;
