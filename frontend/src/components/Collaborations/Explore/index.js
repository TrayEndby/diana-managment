import React, { useState, useEffect } from 'react';

import ProjectList from '../ProjectList';

import useErrorHandler from '../../../util/hooks/useErrorHandler';
import collabService from '../../../service/CollaborationService';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler(null);

  useEffect(() => {
    setLoading(true);
    collabService
      .getPublicProjects()
      .then(([retProjects, retRoles]) => {
        setProjects(retProjects.reverse());
        setRoles(retRoles);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [setError]);

  return <ProjectList projects={projects} roles={roles} loading={loading} error={error} />;
};

export default React.memo(Explore);
