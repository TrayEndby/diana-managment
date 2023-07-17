import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.module.scss';
import cn from 'classnames';

import Form from 'react-bootstrap/Form';

const propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

const QualifiedInstitutions = ({ values, onChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center">Qualified Institutions</h3>
      <p className={cn("text-white text-center", style.textSmall)}>(Award may be used at)</p>
      {values.map(({ id, name, selected }) => {
        return (
          <Form.Check
            className="text-white"
            key={id}
            id={'QualifiedInstitutions-' + name}
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

QualifiedInstitutions.propTypes = propTypes;

export default QualifiedInstitutions;
