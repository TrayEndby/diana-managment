import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';
import Form from 'react-bootstrap/Form';

const propTypes = {
  onEvaluationChange: PropTypes.func.isRequired,
  onAdmittedPercentageChange: PropTypes.func.isRequired,
  safety: PropTypes.bool.isRequired,
  target: PropTypes.bool.isRequired,
  reach: PropTypes.bool.isRequired,
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
};

const inputStyle = { maxWidth: '55px' };

const Admissions = ({ onEvaluationChange, onAdmittedPercentageChange, safety, target, reach, min, max }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Chancing</h3>
      <Form.Label className="text-white text-center">Admission difficulty</Form.Label>
      <Form.Check
        className="text-white"
        id="evaluationSafety"
        checked={safety}
        type="checkbox"
        label="Safety"
        onChange={onEvaluationChange}
      />
      <Form.Check
        className="text-white"
        id="evaluationTarget"
        checked={target}
        type="checkbox"
        label="Target"
        onChange={onEvaluationChange}
      />
      <Form.Check
        className="text-white"
        id="evaluationReach"
        checked={reach}
        type="checkbox"
        label="Reach"
        onChange={onEvaluationChange}
      />
      <Form.Label className="mt-2 text-white">Admitted percentage</Form.Label>
      <div className="d-flex flex-row">
        <Form.Control
          name="percentageAdmittedMin"
          className="p-1"
          style={inputStyle}
          type="number"
          min="0"
          max="99"
          value={min}
          placeholder="min"
          onChange={onAdmittedPercentageChange}
        />
        <div className="align-self-center text-white">&nbsp;%</div>
        <div className="align-self-center">&nbsp;-&nbsp;</div>
        <Form.Control
          name="percentageAdmittedMax"
          className="p-1"
          style={inputStyle}
          type="number"
          min="1"
          max="100"
          value={max}
          placeholder="max"
          onChange={onAdmittedPercentageChange}
        />
        <div className="align-self-center text-white">&nbsp;%</div>
      </div>
    </Form.Group>
  );
};

Admissions.propTypes = propTypes;

export default Admissions;
