import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { CaretUpFill } from 'react-bootstrap-icons';

import style from './style.module.scss';

const propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

const AddCommentButton = ({ top, left, onClick }) => {
  return createPortal(
    <div
      className={classNames(style.add, {
        [style.left]: left < 50,
      })}
      style={{
        position: 'absolute',
        top: top + 10,
        left,
      }}
    >
      <CaretUpFill />
      <div onClick={onClick}>Add a comment</div>
    </div>,
    document.querySelector('#essay-compose .ql-container'),
  );
};

AddCommentButton.propTypes = propTypes;

export default AddCommentButton;
