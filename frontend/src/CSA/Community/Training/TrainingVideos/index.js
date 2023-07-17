import React, { useEffect, useState, useCallback } from 'react';

import VideoList from './List';
import TrainingContainer from '../Container';

import ErrorDialog from 'util/ErrorDialog';
import useErrorHandler from 'util/hooks/useErrorHandler';
import Loading from 'util/Loading';
import marketService from 'service/CSA/MarketService';
import authService from 'service/AuthService';
import './style.scss';

const propTypes = {};

const TrainingVideo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [videos, setVideos] = useState([]);

  const getVideoList = useCallback(() => {
    const userId = authService.getUID();
    marketService
      .listVideos(userId, "csa training")
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
    <TrainingContainer selectedTab={0}>
      <div className="trainingVideoPage">
        <ErrorDialog error={error} />
        <Loading show={loading} />
        <VideoList videos={videos} />
      </div>
    </TrainingContainer>
  );
};

TrainingVideo.propTypes = propTypes;

export default TrainingVideo;
