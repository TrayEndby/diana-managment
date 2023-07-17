import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './style.module.scss';
import './style.scss';

const propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  isPrivate: PropTypes.bool,
};

const VideoCard = ({ video, isPrivate }) => {
  const { title, source, url } = video;
  return (
    <div className={classNames('card', style.video)}>
      <div className={style.top}>
        <video controls controlsList="nodownload">
          {isPrivate && <source type="video/mp4" src={url} controlsList="nodownload" />}
          {(!isPrivate || isPrivate == null) && <source type="video/mp4" src={url} />}
        </video>
      </div>
      <h6>{title}</h6>
      <div className="App-textOverflow p-0 mb-1">{source}</div>
    </div>
  );
};

VideoCard.propTypes = propTypes;

export default VideoCard;
