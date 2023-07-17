import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Carousels from '../Carousels';
import EditVideoModal from './EditModal';

import VideoCard from 'CSA/Marketing/Video/Card';

import { getItemsFromIds } from './util';
import Body from 'util/Body';
import useErrorHandler from 'util/hooks/useErrorHandler';
import markerService from 'service/CSA/MarketService';

import styles from '../style.module.scss';

const propTypes = {
  editable: PropTypes.bool,
  user_id: PropTypes.string,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const VideosSection = ({ editable, user_id, ids, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [videos, setVideos] = useState([]);
  const [videoToEdit, setVideoToEdit] = useState(null);

  useEffect(() => {
    markerService
      .listVideos(user_id)
      .then((res) => {
        setVideos(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [user_id, setError]);

  const handleEdit = (index) => {
    setVideoToEdit(index);
  };

  const items = getItemsFromIds(ids, videos).map((video) => video ? <VideoCard video={video} noShare /> : null);

  const handleUpdate = (videoId) => {
    const index = Math.min(ids.length, videoToEdit);
    onUpdate(index, videoId);
    setVideoToEdit(null);
  };

  return (
    <section className={cn(styles.lister, styles.videos)}>
      <Body loading={loading} error={error}>
        <header>
          <h5>VIDEOS</h5>
        </header>
        <Carousels editable={editable} className={styles.content} items={items} onEdit={handleEdit} />
        {videoToEdit != null && (
          <EditVideoModal
            videos={videos}
            id={ids[videoToEdit] || null}
            onUpdate={handleUpdate}
            onClose={() => setVideoToEdit(null)}
          />
        )}
      </Body>
    </section>
  );
};

VideosSection.propTypes = propTypes;

export default React.memo(VideosSection);
