import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import EssayPageLayout from './Layout';
import SavedEssayPage from './Saved';
import MyArticlesPage from './MyArticles';
import EssaySearchPage from './Search';
import EssayDetailPage from './Detail';
import ClusterDetailPage from './ClusterDetail';
import ComposePage from './Compose';

import { getSearchKeyFromURL } from './util';
import ErrorDialog from '../../util/ErrorDialog';
import useErrorHandler from '../../util/hooks/useErrorHandler';
import playListService from '../../service/PlayListService';
import * as ROUTES from '../../constants/routes';

const EssayPage = () => {
  const history = useHistory();
  const [savedEssays, setSavedEssays] = useState([]);
  const [error, setError] = useErrorHandler();
  const [search, setSearch] = useState('');

  const fetchSavedEssaysList = React.useCallback(async () => {
    try {
      const res = await playListService.listEssays();
      setSavedEssays(res);
    } catch (error) {
      setError(error);
    }
  }, [setError]);

  useEffect(() => {
    fetchSavedEssaysList();
  }, [fetchSavedEssaysList]);

  useEffect(() => {
    const searchKey = getSearchKeyFromURL(history.location.search);
    if (searchKey !== "") {
      setSearch(searchKey);
    }
  }, [history.location.search]);

  return (
    <EssayPageLayout search={search} savedEssays={savedEssays}>
      <ErrorDialog error={error} />
      <Switch>
        <Route path={`${ROUTES.ESSAY_SAVED}/:id`}>
          {/* TODO: Rewrite this to SidebarPageLayout */}
          <SavedEssayPage />
        </Route>
        <Route path={ROUTES.ESSAY_MY_ESSAY}>
          <MyArticlesPage />
        </Route>
        <Route path={`${ROUTES.ESSAY_COMPOSE}/:id`}>
          <ComposePage shareTitle='Share my essay' onClose={() => history.push(ROUTES.ESSAY_MY_ESSAY)} />
        </Route>
        <Route path={`${ROUTES.ESSAY_PUBLIC}/:id`}>
          <EssayDetailPage myEssaysList={savedEssays} onSave={fetchSavedEssaysList} />
        </Route>
        <Route path={`${ROUTES.ESSAY_CLUSTER}/:id`}>
          <ClusterDetailPage />
        </Route>
        <Route exact path={ROUTES.ESSAY}>
          <EssaySearchPage />
        </Route>
        <Redirect to={ROUTES.ESSAY} />
      </Switch>
    </EssayPageLayout>
  );
};

export default EssayPage;
