import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const propTypes = {
  sportsList: PropTypes.array.isRequired,
  MenSports: PropTypes.object.isRequired,
  WomenSports: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

const Sports = ({ sportsList, MenSports, WomenSports, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Sports teams</h3>
      <Row>
        <Col xs="8" className="pr-0"></Col>
        <Col xs="1" className="pl-0 text-white">M</Col>
        <Col xs="1" className="text-white">W</Col>
      </Row>
      {sportsList.map(({ id, name }) => (
        <Row key={id}>
          <Col xs="8" className="pr-0 text-white">{name}</Col>
          <Col xs="1" className="pl-0">
            <Form.Check type="checkbox" checked={MenSports[id] || false} onChange={() => onChange('MenSports', id)} />
          </Col>
          <Col xs="1">
            <Form.Check type="checkbox" checked={WomenSports[id] || false} onChange={() => onChange('WomenSports', id)} />
          </Col>
        </Row>
      ))}
    </Form.Group>
  );
};

Sports.propTypes = propTypes;

export default Sports;
