import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import Button from 'react-bootstrap/Button';

import Explore from './Explore';
import Saved from './Saved';
import SearchBar from './SearchBar';
import Create from './Create';

import style from './style.module.scss';
import Completed from './Completed';

export const programsTabs = [
  {
    name: 'Explore',
    path: ROUTES.PROGRAMS_EXPLORE,
  },
  {
    name: 'Saved',
    path: ROUTES.PROGRAMS_SAVED,
  },
];

const SummerPrograms = () => {
  const history = useHistory();

  useEffect(() => {}, []);

  return (
    <Container className={style.container}>
      <div style={ history.location.pathname === ROUTES.PROGRAMS_CREATE ? { display: 'none'} : {} }>
        <SearchBar route={ROUTES.SEARCH} />
        <div className={style.addButton}>
          <Button
            variant="primary"
            style={{ width: '170px', marginRight: '24px' }}
            onClick={() => history.push(ROUTES.PROGRAMS_CREATE)}
          >
            Add new program
          </Button>
        </div>
      </div>
      <Switch>
        <Redirect exact from={ROUTES.ORGANIZATIONS} to={ROUTES.ORGANIZATIONS_EXPLORE} />
        <Route path={ROUTES.PROGRAMS_EXPLORE} component={Explore} />
        <Route path={ROUTES.PROGRAMS_COMPLETED} component={Completed} />
        <Route path={ROUTES.PROGRAMS_SAVED} component={Saved} />
        <Route path={ROUTES.PROGRAMS_CREATE} component={Create} />
      </Switch>
    </Container>
  );
};

export default React.memo(SummerPrograms);
