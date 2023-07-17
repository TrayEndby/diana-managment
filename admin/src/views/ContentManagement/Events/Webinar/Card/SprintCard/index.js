import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import NoSpeakerWebinarImage from "assets/WebinarTemplate1.png";
import SpeakerWebinarImage from "assets/WebinarTemplate2.png";
import SpeakerDiv from "../SpeakerDiv";

import style from "../../style.module.scss";

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
  lessTitle,
  startDateStr,
  speakers,
  loading,
  size,
  toURL,
}) => {
  return (
    <div className={cn("webinar", className)}>
      {!loading && (
        <div>
          <div className={style.scheduleCard}>
            <div
              className={cn(style.scheduleItem, {
                [style.small]: size === "sm",
              })}
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
            </div>
          </div>
          <div className={style.titleDiv}>{lessTitle}</div>
        </div>
      )}
    </div>
  );
};

SprintCard.propTypes = propTypes;

export default SprintCard;
