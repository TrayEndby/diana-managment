import React from 'react';
import {
  Link
} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import * as ROUTES from '../../../constants/routes';

const BackToMyListButton = () => (
  <Link to={ROUTES.COLLEGE}>
    <Button className="ml-auto">
      My colleges
    </Button>
  </Link>
)

export default BackToMyListButton;