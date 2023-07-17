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
};

const SprintCard = ({
  className,
  item,
  noShare,
  lessTitle,
  startDateStr,
  speakers,
  loading,
  size,
  toURL,
}) => {
  const { title, location, description, url, videoURL } = item;
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
                  <div className={style.header2}>SPRINT PROGRAM</div>

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
                    {startDateStr}
                  </div>
                  <div className={style.duration}>
                    Duration: 5 online workshops every Saturday, 60 min each
                  </div>
                </div>
                <SpeakerDiv speakers={speakers} />
              </div>
            </div>
            {size !== 'sm' && (
              <div
                className="rightSection"
                style={{ minHeight: '200px', paddingTop: '0px' }}
              >
                <Link className={style.scheduleTitle} to={toURL}>
                  {title}
                </Link>

                <h6 style={{ fontWeight: 'bolder', marginTop: '8px' }}>
                  Duration:{' '}
                  <p style={{ display: 'inline', fontStyle: 'italic' }}>
                    5 online workshops
                  </p>{' '}
                  every Saturday, 60 min each
                </h6>
                <h6 style={{ fontWeight: 'bolder', marginTop: '24px' }}>
                  {startDateStr}
                </h6>
                <a
                  style={{ fontWeight: 'bolder', marginTop: '8px' }}
                  target={'_blank'}
                  href={url}
                  rel="noopener noreferrer"
                >
                  {location}
                </a>
                <br />
                {videoURL != null && (
                  <div style={{ marginTop: '8px' }}>
                    <a
                      target="_blank"
                      href={videoURL}
                      rel="Intro Video noopener noreferrer"
                    >
                      Click here to see replays...
                    </a>
                  </div>
                )}
                <h6 style={{ marginTop: '12px' }}>{description}</h6>
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

SprintCard.propTypes = propTypes;

export default SprintCard;
