import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.module.scss'
import Form from 'react-bootstrap/Form';
import InputRange from 'react-input-range';

const propTypes = {
  awardAmount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AwardAmount = ({ awardAmount, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Award amount</h3>
      <CostLabel label="Max award amount" cost={awardAmount} />
      <CostInput name="award_amount" cost={awardAmount} onChange={onChange} />
    </Form.Group>
  );
};

const CostLabel = ({ label, cost }) => (
  <Form.Label className="text-white">{cost > 0 ? `${label}: >= $${cost.toLocaleString()}` : `${label}: N/A`}</Form.Label>
);

const CostInput = ({ name, cost, onChange }) => (
  <InputRange
    minValue={0}
    maxValue={50000}
    value={cost}
    onChange={value => onChange({ [name]: value })} />
);

AwardAmount.propTypes = propTypes;

export default AwardAmount;
