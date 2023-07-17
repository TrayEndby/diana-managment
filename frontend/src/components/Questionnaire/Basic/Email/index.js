import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Tooltip from 'util/Tooltip';

const propTypes = {
  email: PropTypes.string,
};

const EmailProfile = ({ email }) => {
  return (
    <Form>
      <Form.Group controlId="user-profile-email">
        <Form.Label>Email</Form.Label>
        <Tooltip title="Read only">
          <Form.Control disabled={true} name="email" value={email || ''} />
        </Tooltip>
      </Form.Group>
    </Form>
  );
};

EmailProfile.propTypes = propTypes;

export default EmailProfile;
