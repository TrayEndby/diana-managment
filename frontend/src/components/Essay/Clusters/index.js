import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import WordCloudSection from '../WordCloud';

import FrameCard from 'util/FrameCard';

import * as ROUTES from 'constants/routes';
import style from './style.module.scss';

const propTypes = {
  loading: PropTypes.bool.isRequired,
  clusters: PropTypes.array,
};

const ClustersList = ({ loading, clusters }) => {
  const history = useHistory();
  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  } else if (clusters == null) {
    return null;
  } else if (clusters.length === 0) {
    return <div className="text-white text-center">No results found</div>;
  } else {
    return (
      <>
        <h5 className="mx-3">Essay themes:</h5>
        <div className={style.clusters}>
          {clusters.map(({ id, center_essay_title, cluster_size, wordcloud }) => (
            <FrameCard
              className={style.cluster}
              img={<WordCloudSection key={id} data={wordcloud} width={180} height={130} className="p-1" />}
              onClick={() => {
                history.push(`${ROUTES.ESSAY_CLUSTER}/${id}`);
              }}
            >
              <div className="App-text-overflow">Total essays: {cluster_size}</div>
              <div className="block-with-text-2">Sample essay: {center_essay_title}</div>
            </FrameCard>
          ))}
        </div>
      </>
    );
  }
};

ClustersList.propTypes = propTypes;

export default React.memo(ClustersList);
