import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from 'react-bootstrap/Card';

import styles from './style.module.scss';

const propTypes = {
  img: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  ratio: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

const FrameCard = ({ className, style, img, children, onClick, ratio }) => {
  return (
    <Card
      className={classNames(styles.card, className, {
        [styles.clickable]: onClick != null,
      })}
      style={{ ...style }}
      onClick={onClick}
    >
      <div className="imgContainer">
        <div className="layer1" style={{ paddingTop: ratio ? `${ratio * 100}%` : null }}>
          {img}
        </div>
      </div>
      <div className="content">{children}</div>
    </Card>
  );
};

FrameCard.propTypes = propTypes;

export default React.memo(FrameCard);
