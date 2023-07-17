import React from 'react';
import {
  Link
} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import * as ROUTES from '../../../constants/routes';

const BackToMyListButton = () => (
  <Link to={ROUTES.FIN_AID}>
    <Button className="ml-auto">
      My aid list
    </Button>
  </Link>
)

export default BackToMyListButton;