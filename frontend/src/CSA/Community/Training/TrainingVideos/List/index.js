import React from 'react';
import PropTypes from 'prop-types';

import VideoCard from '../Card';
import withInfiniteList from 'util/HOC/withInfiniteList';

const propTypes = {
  videos: PropTypes.array,
};

const VideoListCard = ({ item }) => <VideoCard video={item} />;

const List = withInfiniteList(VideoListCard);

const VideoList = ({ videos }) => {
  return (
    <List
      className='App-grid-list'
      items={videos}
    />
  )
};

VideoList.propTypes = propTypes;

export default VideoList;
