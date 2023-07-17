import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.module.scss';

import Form from 'react-bootstrap/Form';

const propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Residency = ({ values, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Residency</h3>
      {values.map(({ id, name, selected }) => {
        return (
          <Form.Check
            className="text-white"
            key={id}
            id={'Residency-' + name}
            type="checkbox"
            label={name}
            onChange={() => onChange(id)}
            checked={selected}
          />
        )
      }
      )}
    </Form.Group>
  );
};

Residency.propTypes = propTypes;

export default Residency;
