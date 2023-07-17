import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';

const propTypes = {
  row: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const SelfDescribe = ({ row, label, value, onChange }) => {
  if (row) {
    return (
      <Form.Group as={Row}>
        <Form.Label className="text-right" column sm="3">
          {label}
        </Form.Label>
        <Col sm="8">
          <CheckSection value={value} onChange={onChange} />
        </Col>
      </Form.Group>
    );
  } else {
    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <CheckSection value={value} onChange={onChange} />
      </Form.Group>
    );
  }
};

const CheckSection = ({ value, onChange }) => {
  const other_self_describe =
    value !== 'kyros-student' &&
    value !== 'kyros-parent' &&
    value !== 'kyros-educator';
  return (
    <>
      <Form.Check
        type="radio"
        label="Student"
        checked={value === 'kyros-student'}
        onChange={() => onChange('kyros-student')}
      />
      <Form.Check
        type="radio"
        label="Parent"
        checked={value === 'kyros-parent'}
        onChange={() => onChange('kyros-parent')}
      />
      <Form.Check
        type="radio"
        label="Educator"
        checked={value === 'kyros-educator'}
        onChange={() => onChange('kyros-educator')}
      />
      <Form.Check
        type="radio"
        label="Other"
        checked={other_self_describe}
        onChange={() => onChange('')}
      />
      <Form.Control
        type="text"
        size="sm"
        value={other_self_describe ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!other_self_describe}
      />
    </>
  );
};

SelfDescribe.propTypes = propTypes;

export default SelfDescribe;
