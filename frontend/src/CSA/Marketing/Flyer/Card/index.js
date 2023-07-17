import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Button from 'react-bootstrap/Button';

import ShareButtons from '../../ShareButtons';

import style from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  flyer: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  noShare: PropTypes.bool,
};

const FlyerCard = ({ className, flyer, noShare }) => {
  const { title, url } = flyer;
  const ref = useRef();

  return (
    <div className={cn('card', style.flyer, className)}>
      <div className={style.top}>
        <embed ref={ref} title={title} src={`${url}#toolbar=0&navpanes=0&scrollbar=0`} width="100%" height="100%" />
        <Button onClick={() => window.open(url)}>View</Button>
      </div>
      <h6>{title}</h6>
      {!noShare && <ShareButtons url={url} />}
    </div>
  );
};

FlyerCard.propTypes = propTypes;

export default FlyerCard;
