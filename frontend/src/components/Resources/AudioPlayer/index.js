import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PlayFill, PauseFill, VolumeUpFill, VolumeMuteFill } from 'react-bootstrap-icons';

import { hhmmss } from '../util';

import style from './style.module.scss';

const propTypes = {
  podcast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isSoundCloud: PropTypes.bool.isRequired,
  }).isRequired,
};

const AudioPlayer = ({ podcast }) => {
  return podcast.isSoundCloud ? <SoundCloudPlayer podcast={podcast} /> : <NormalPlayer podcast={podcast} />;
};

const SoundCloudPlayer = ({ podcast }) => {
  const ref = useRef();
  const { url, title } = podcast;

  return (
    <div className={style.audioContainer}>
      <iframe ref={ref} title={title} width="100%" scrolling="no" frameBorder="no" allow="autoplay" src={`${url}&auto_play=true&download=false`} />
    </div>
  );
};

const NormalPlayer = ({ podcast }) => {
  const { url, title } = podcast;
  const audioRef = useRef();
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);

  const handleCanPlay = () => {
    setLoading(false);
    setDuration(audioRef.current.duration);
    setPaused(audioRef.current.paused);
    setVolume(audioRef.current.volume);
  };

  const handlePlay = () => {
    if (!audioRef.current) {
      return;
    }
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.volume === 0) {
      // unmute
      audioRef.current.volume = lastVolume;
    } else {
      setLastVolume(audioRef.current.volume);
      audioRef.current.volume = 0;
    }
  };

  const ICON_SIZE = 30;

  return (
    <div className={style.audioContainer}>
      <audio
        ref={audioRef}
        autoPlay={true}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onVolumeChange={() => setVolume(audioRef.current.volume)}
        onTimeUpdate={() => setTime(audioRef.current.currentTime)}
        onCanPlay={handleCanPlay}
      >
        <source src={url} type="audio/mpeg" />
      </audio>
      <div
        className={classNames(style.audioWidgets, {
          'App-disabled': loading,
        })}
      >
        <div className={style.controls}>
          <div className={style.play} onClick={handlePlay}>
            {paused ? <PlayFill size={ICON_SIZE} /> : <PauseFill size={ICON_SIZE} />}
          </div>
        </div>
        <div className={style.infos}>
          <h6>{title}</h6>
          <div className={style.tracks}>
            <Progress
              now={duration === 0 ? 0 : (time / duration) * 100}
              onClick={(percentage) => {
                audioRef.current.currentTime = duration * percentage;
              }}
            />
            <div className={style.time}>{`${hhmmss(time)} / ${hhmmss(duration)}`}</div>
          </div>
        </div>
        <div className={style.volume}>
          <Progress now={volume * 100} onClick={(volume) => (audioRef.current.volume = volume)} />
          {volume === 0 ? (
            <VolumeMuteFill size={ICON_SIZE} onClick={toggleMute} />
          ) : (
            <VolumeUpFill size={ICON_SIZE} onClick={toggleMute} />
          )}
        </div>
      </div>
    </div>
  );
};

const Progress = ({ now, onClick }) => {
  const handleClick = (e) => {
    try {
      const percentage = (e.clientX - e.target.offsetLeft) / e.target.offsetWidth;
      onClick(percentage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.progress} onClick={handleClick}>
      <div
        className={style.progressBar}
        style={{
          width: now + '%',
        }}
      ></div>
    </div>
  );
};

AudioPlayer.propTypes = propTypes;

export default AudioPlayer;
