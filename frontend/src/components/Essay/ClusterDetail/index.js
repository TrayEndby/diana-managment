import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';

import EssayList from '../List';

import { getPublicEssayURL } from '../util';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import ErrorDialog from '../../../util/ErrorDialog';
import Loading from '../../../util/Loading';
import essayService from '../../../service/EssayService';

const propTypes = {};

const ClusterDetail = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [essays, setEssays] = useState([]);
  const [error, setError] = useErrorHandler();
  const history = useHistory();

  const cluster_id = match.params.id;

  useEffect(() => {
    setLoading(true);
    essayService
      .getClusterEssayIds(cluster_id)
      .then((ids) => {
        return essayService.getEssays(ids);
      })
      .then((res) => {
        setEssays(res);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [cluster_id, setError]);

  return (
    <>
      <ErrorDialog error={error} />
      <Loading show={loading} variant="white" className="w-100" />
      {!loading && (
        <EssayList
          essays={essays}
          view="list"
          onClick={(selectedEssay) => {
            history.push(getPublicEssayURL(selectedEssay.id));
          }}
        />
      )}
    </>
  );
};

ClusterDetail.propTypes = propTypes;

export default React.memo(withRouter(ClusterDetail));
