import React, { useState } from 'react';


import ProjectList from '../ProjectList';

import useErrorHandler from '../../../util/hooks/useErrorHandler';
import collaborationService from '../../../service/CollaborationService';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler(null);

  React.useEffect(() => {
    setLoading(true);
    collaborationService
      .getMyProjects()
      .then(([retProjects, retRoles]) => {
        setProjects(retProjects.reverse());
        setRoles(retRoles);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [setError]);

  return <ProjectList projects={projects} roles={roles} loading={loading} error={error} myProjectOnly/>;
};

export default React.memo(MyProjects);
