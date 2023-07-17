import React, { useEffect, useState, useCallback } from 'react';
import cn from 'classnames';

import VideoList from './List';
import Container from 'CSA/Container';

import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import Loading from 'util/Loading';
import markerService from 'service/CSA/MarketService';
import authService from 'service/AuthService';

import style from '../style.module.scss';

const propTypes = {};

const VideoSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [videos, setVideos] = useState([]);

  const getVideoList = useCallback(() => {
    const userId = authService.getUID();
    markerService
      .listVideos(userId, "csa marketing")
      .then((res) => {
        setVideos(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [setError]);

  useEffect(() => {
    getVideoList();
  }, [getVideoList]);

  return (
    <Container title="Videos" className={cn('App-body', style.container)}>
      <div className="App-grid-list-container">
        <ErrorDialog error={error} />
        <Loading show={loading} />
        <VideoList videos={videos} />
      </div>
    </Container>
  );
};

VideoSection.propTypes = propTypes;

export default VideoSection;
