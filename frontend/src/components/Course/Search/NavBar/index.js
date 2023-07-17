import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import * as ROUTES from 'constants/routes';

const propTypes = {};

const SearchNavBar = () => {
  const history = useHistory();
  return (
    <Button
      className="search"
      onClick={() => {
        history.push(ROUTES.COURSE);
      }}
    >
      Explore
    </Button>
  );
};

SearchNavBar.propTypes = propTypes;

export default SearchNavBar;
