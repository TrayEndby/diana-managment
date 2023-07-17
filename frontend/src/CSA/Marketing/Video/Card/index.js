import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import ShareButtons from '../../ShareButtons';

import style from './style.module.scss';

const propTypes = {
  className: PropTypes.string,
  video: PropTypes.shape({
    title: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  noShare: PropTypes.bool,
};

const VideoCard = ({ className, video, noShare }) => {
  const { title, source, image_url, url } = video;
  const [load, setLoad] = useState(false);
  return (
    <div className={cn('card', 'mb-5', style.video, className)}>
      <div className={style.top}>
        {url.indexOf('youtu') === -1 && (
          <video controls>
            <source type="video/mp4" src={url} />
          </video>
        )}
        {url.indexOf('youtu') !== -1 && !load && (
          <div
            className={cn('w-100 h-100', style.thumbnail)}
            style={{
              backgroundImage: `url(${image_url})`,
            }}
            onClick={() => setLoad(true)}
          />
        )}
        {url.indexOf('youtu') !== -1 && load && (
          <iframe
            title="video"
            src={url}
            className={cn('w-100', 'h-100')}
            allowFullScreen
          ></iframe>
        )}
      </div>
      <h6 className="mt-1">{title}</h6>
      <div className="source App-textOverflow mb-1">{source}</div>
      {!noShare && <ShareButtons url={url} />}
    </div>
  );
};

VideoCard.propTypes = propTypes;

export default VideoCard;
