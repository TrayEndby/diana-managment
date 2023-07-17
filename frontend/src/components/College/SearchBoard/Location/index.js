import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

import Form from 'react-bootstrap/Form';

const propTypes = {
  campusSettings: PropTypes.array.isRequired,
  onCampusSettingsChange: PropTypes.func.isRequired,
};

const Location = ({ campusSettings, onCampusSettingsChange }) => {
  return (
    <Form.Group className={style.container}>
      <h3 className="text-white text-center pb-3">Location</h3>
      {/* campus settings */}
      <Form.Label className="text-white">Campus setting</Form.Label>
      {campusSettings.map(({ id, name, selected }) => (
        <Form.Check
          className="text-white"
          key={id}
          id={'Location' + name}
          type="checkbox"
          label={name}
          checked={selected}
          onChange={() => onCampusSettingsChange(id)}
        />
      ))}
    </Form.Group>
  );
};

Location.propTypes = propTypes;

export default Location;
