import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss'
import Form from 'react-bootstrap/Form';
import InputRange from 'react-input-range';

const propTypes = {
  inStateTuition: PropTypes.number.isRequired,
  outStateTuition: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Cost = ({ inStateTuition, outStateTuition, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Cost</h3>
      <CostLabel label="In state tuition" cost={inStateTuition} />
      <CostInput name="inStateTuition" cost={inStateTuition} onChange={onChange} />
      <CostLabel label="Oute state tuition" cost={outStateTuition} />
      <CostInput name="outStateTuition" cost={outStateTuition} onChange={onChange} />
    </Form.Group>
  );
};

const CostLabel = ({ label, cost }) => (
  <Form.Label className="text-white">{cost > 0 ? `${label}: <= $${cost.toLocaleString()}` : `${label}: N/A`}</Form.Label>
);

const CostInput = ({ name, cost, onChange }) => (
  <InputRange
    minValue={0}
    maxValue={60000}
    value={cost}
    onChange={value => onChange({ [name]: value })} />
);

Cost.propTypes = propTypes;

export default Cost;
