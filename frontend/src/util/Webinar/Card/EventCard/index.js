import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import ShareButtons from '../../../ShareButtons';
import NoSpeakerWebinarImage from 'assets/WebinarTemplate1.png';
import SpeakerWebinarImage from 'assets/WebinarTemplate2.png';
import SpeakerDiv from '../SpeakerDiv';

import { SERVER_URL } from 'constants/server';
import style from '../../style.module.scss';

const propTypes = {
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  noShare: PropTypes.bool,
  loading: PropTypes.bool,
  toURL: PropTypes.string,
  lessTitle: PropTypes.string,
  startDateStr: PropTypes.string,
  shortStartDateStr: PropTypes.string,
  speakers: PropTypes.array,
  size: PropTypes.string,
  type: PropTypes.number,
};

const EventCard = ({
  className,
  item,
  noShare,
  startDateStr,
  shortStartDateStr,
  toURL,
  lessTitle,
  speakers,
  loading,
  size,
  type,
}) => {
  const { duration, title, location, description, url, videoURL } = item;
  return (
    <div className={cn('webinar', className)}>
      {!loading && (
        <div className={style.scheduleCard}>
          <div
            className={cn(style.scheduleItem, {
              [style.small]: size === 'sm',
            })}
            onClick={
              size === 'sm'
                ? () => {
                    const win = window.open(
                      `${SERVER_URL}${toURL.substring(1)}`,
                      '_blank',
                    );
                    win.focus();
                  }
                : null
            }
          >
            <div className="leftSection">
              <div
                className="image"
                style={{
                  backgroundImage:
                    speakers === null
                      ? `url(${NoSpeakerWebinarImage})`
                      : `url(${SpeakerWebinarImage})`,
                }}
              >
                <div className={style.scheduleImageInfo}>
                  <div className={style.header1}>RISE WITH KYROS</div>
                  <div className={style.header2}>LIVE WEBINAR</div>
                  <div
                    className={cn(style.title, {
                      [style.noSpeaker]: speakers == null,
                    })}
                  >
                    {lessTitle}
                  </div>
                  <div
                    className={cn(style.date, {
                      [style.noSpeaker]: speakers == null,
                    })}
                  >
                    {shortStartDateStr}
                  </div>
                  <div className={style.duration}>Duration: {duration}</div>
                </div>
                <SpeakerDiv speakers={speakers} />
              </div>
            </div>
            {size !== 'sm' && (
              <div
                className="rightSection"
                style={
                  location != null
                    ? { minHeight: '200px', paddingTop: '0px' }
                    : { minHeight: '200px', paddingTop: '15px' }
                }
              >
                <Link className={style.scheduleTitle} to={toURL}>
                  {title}
                </Link>
                {duration != null && (
                  <h6 style={{ fontWeight: 'bolder', marginTop: '8px' }}>
                    Duration: {duration}
                  </h6>
                )}
                <h6 style={{ fontWeight: 'bolder', marginTop: '24px' }}>
                  {startDateStr}
                </h6>
                {location != null && (
                  <a
                    style={{ fontWeight: 'bolder', marginTop: '8px' }}
                    target={'_blank'}
                    href={url}
                    rel="noopener noreferrer"
                  >
                    {location}
                  </a>
                )}
                <br />
                {videoURL != null && (
                  <div
                    style={
                      location != null
                        ? { marginTop: '8px' }
                        : { marginTop: '-18px' }
                    }
                  >
                    {type === 1 && (
                      <a
                        target="_blank"
                        href={videoURL}
                        rel="Intro Video noopener noreferrer"
                      >
                        Click here to see replays...
                      </a>
                    )}
                    {type === 3 && (
                      <a
                        target="_blank"
                        href={videoURL}
                        rel="Reply Session noopener noreferrer"
                      >
                        The replay of the session
                      </a>
                    )}
                  </div>
                )}
                <h6
                  style={
                    location != null
                      ? videoURL != null
                        ? { marginTop: '12px' }
                        : { marginTop: '24px' }
                      : { marginTop: '12px' }
                  }
                >
                  {description}
                </h6>
                {!noShare && (
                  <div style={{ height: '32px', marginTop: '16px' }}>
                    <ShareButtons />
                  </div>
                )}
              </div>
            )}
            {size === 'sm' && <div className="rightSection">{description}</div>}
          </div>
          {size !== 'sm' && <div className={style.splitter}></div>}
        </div>
      )}
    </div>
  );
};

EventCard.propTypes = propTypes;

export default EventCard;
