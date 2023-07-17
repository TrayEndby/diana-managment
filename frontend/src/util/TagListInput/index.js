import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import userProfileListService from 'service/UserProfileListService';

const propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  controlId: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
};

const TagListInput = ({ label, required, disabled, controlId, name, value, className, style, onChange }) => {
  const [loading, setLoading] = useState(true);
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    setLoading(true);
    userProfileListService
      .getListTags()
      .then(setTagList)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Form.Group className={className} style={{ ...style }}>
      {label && <Form.Label>{label}</Form.Label>}
      {loading && (
        <Form.Control required={required} as="select">
          <option>Loading...</option>
        </Form.Control>
      )}
      {!loading && (
        <Form.Control
          controlId={controlId}
          required={required}
          disabled={disabled}
          as="select"
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="">Choose tags from the list</option>
          {tagList.map(({id, name}) => (
            <option key={id} value={name}>
              {name}
            </option>
          ))}
        </Form.Control>
      )}
    </Form.Group>
  );
};

TagListInput.propTypes = propTypes;

export default TagListInput;

export const DEFAULT_TAG = 'Sprint Program';
