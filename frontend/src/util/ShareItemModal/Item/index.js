import React from 'react';
import PropTypes from 'prop-types';

import { Trash } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';

import Tooltip from '../../Tooltip';

const propTypes = {
  userInfo: PropTypes.shape({ user_id: PropTypes.string, user_name: PropTypes.string }),
  onDelete: PropTypes.func.isRequired,
};

const SharedUserItem = ({ userInfo, onDelete }) => {
  if (!userInfo) {
    return null;
  }
  const { user_name, user_id } = userInfo;
  return (
    <div className="d-flex flex-row">
      <Col sm="11" className="pl-0 mb-2">
        {user_name}
      </Col>
      <Col sm="1">
        <Tooltip title="Remove user">
          <Trash className="App-clickable" onClick={() => onDelete(user_id)} />
        </Tooltip>
      </Col>
    </div>
  );
};

SharedUserItem.propTypes = propTypes;

export default SharedUserItem;
