import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

import Form from 'react-bootstrap/Form';

import collegeService from '../../../../service/CollegeService';

const propTypes = {
  onMajorChange: PropTypes.func.isRequired,
};

const collegeMajors = collegeService.listMajors();
const inputStyle = { maxWidth: '500px' };

const Academics = ({ onMajorChange, selectedMajor }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Academics</h3>
      <Form.Label className="text-white">Best by major (Top 100 in ranking):</Form.Label>
      <Form.Control
        as="select"
        style={inputStyle}
        value={selectedMajor || ''}
        name="major"
        onChange={(e) => onMajorChange(e.target.value)}
      >
        <option value="">N/A</option>
        {collegeMajors.map(({ key, text }) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

Academics.propTypes = propTypes;

export default Academics;
