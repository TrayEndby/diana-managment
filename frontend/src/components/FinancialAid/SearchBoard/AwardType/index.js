import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.module.scss';

import Form from 'react-bootstrap/Form';

const propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AwardType = ({ values, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Award type</h3>
      {values.map(({ id, name, selected }) => {
        return (
          <Form.Check
            className="text-white"
            key={id}
            id={'AwardType-' + name}
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

AwardType.propTypes = propTypes;

export default AwardType;
