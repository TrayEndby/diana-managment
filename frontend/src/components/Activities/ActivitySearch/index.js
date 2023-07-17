import React from 'react';
import { Switch, Redirect, Route, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import FoundedOrganizations from './FoundedOrganizations';
import FoundedSummerPograms from './FoundedSummerPograms';

import * as ROUTES from 'constants/routes';
import SearchBar from '../SummerPrograms/SearchBar';
import style from './style.module.scss';

const ActivitySearch = () => {
  const location = useLocation();
  return (
    <Container className={style.container}>
      <SearchBar route={ROUTES.SEARCH} />
      <Switch>
        <Route path={ROUTES.SEARCH_PROGRAMS} component={FoundedSummerPograms} />
        <Route path={ROUTES.SEARCH_ORGANIZATIONS} component={FoundedOrganizations} />
        <Redirect to={`${ROUTES.SEARCH_PROGRAMS}${location.search}`} />
      </Switch>
    </Container>
  );
};

export default React.memo(ActivitySearch);
