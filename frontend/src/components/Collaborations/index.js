import React, { useState, useEffect } from 'react';
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import * as ROUTES from '../../constants/routes';

import Header from '../../layout/SidebarPageLayout/Header';
import Tabs from '../../util/Tabs';

import Explore from './Explore';
import Create from './Create';
import Workspace from './Workspace';

import style from './style.module.scss';

import MyProjects from './MyProjects';

import userErrorHandler from '../../util/hooks/useErrorHandler';
import ErrorDialog from '../../util/ErrorDialog';
import { parseSearchParams } from '../../util/helpers';
import collaborationService from '../../service/CollaborationService';

export const tabs = [
  {
    name: 'Explore',
    path: ROUTES.COLLABORATIONS_EXPLORE_PROJECTS,
  },
  {
    name: 'My projects',
    path: ROUTES.COLLABORATIONS_MY_PROJECTS,
  },
];

const Collaborations = React.memo(() => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = userErrorHandler(null);
  const { query } = parseSearchParams(history.location.search);

  useEffect(() => {
    collaborationService
      .fetchEnums()
      .then(() => {
        setLoading(false);
      })
      .catch(setError);
  }, [setError]);

  return (
    <div className={style.wrapper}>
      <Container className={style.container}>
        <Header
          searchPlaceholder="Search projects"
          search={query || ''}
          searchURL={history.location.pathname}
          emptyToClear={true}
          btnText="Create project"
          btnOnClick={() => history.push(ROUTES.COLLABORATIONS_CREATE)}
        />
        <Tabs tabs={tabs} />
        {loading && <div>Loading...</div>}
        {error && <ErrorDialog error={error} />}
        {!loading && !error && (
          <Switch>
            <Route path={ROUTES.COLLABORATIONS_MY_PROJECTS} component={MyProjects} />
            <Route path={ROUTES.COLLABORATIONS_EXPLORE_PROJECTS} component={Explore} />
            <Route path={ROUTES.COLLABORATIONS_CREATE} component={Create} />
            <Route path={ROUTES.COLLABORATIONS_WORKSPACE} component={Workspace} />
            <Redirect to={ROUTES.COLLABORATIONS_MY_PROJECTS} />
          </Switch>
        )}
      </Container>
    </div>
  );
});

export default Collaborations;
