import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.module.scss';
import cn from 'classnames';

import Form from 'react-bootstrap/Form';

const propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

const QualifiedStudy = ({ values, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center">Qualified Study</h3>
      <p className={cn("text-white text-center", style.textSmall)}>(Award may be used for)</p>
      {values.map(({ id, name, selected }) => {
        return (
          <Form.Check
            className="text-white"
            key={id}
            id={'QualifiedStudy-' + name}
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

QualifiedStudy.propTypes = propTypes;

export default QualifiedStudy;
