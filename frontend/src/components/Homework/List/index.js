import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import CoachAssignment from './CoachAssignment';
import CoachSubmitted from './CoachSubmitted';
import UserAll from './UserAll';
import UserMy from './UserMy';

import * as ROUTES from 'constants/routes';

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      updated_ts: PropTypes.string.isRequired,
      front_end_status: PropTypes.string.isRequired,
      user_name: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ).isRequired,
  onAction: PropTypes.func.isRequired,
};

const List = ({ items, onAction }) => {
  return (
    <Switch>
      <Route path={`${ROUTES.HOMEWORK_ADMIN_ASSIGNMENT}`}>
        <CoachAssignment items={items} onAction={onAction} />
      </Route>
      <Route path={`${ROUTES.HOMEWORK_ADMIN_SUBMITTED}`}>
        <CoachSubmitted items={items} onAction={onAction} />
      </Route>
      <Route path={`${ROUTES.HOMEWORK_USER_ALL}`}>
        <UserAll items={items} onAction={onAction} />
      </Route>
      <Route path={`${ROUTES.HOMEWORK_USER_MY}`}>
        <UserMy items={items} onAction={onAction} />
      </Route>
      <div>Please selected a sprint program on the left bar</div>
    </Switch>
  );
};

List.propTypes = propTypes;

export default withRouter(List);
