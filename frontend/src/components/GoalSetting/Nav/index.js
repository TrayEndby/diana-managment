import React from 'react';

import ArrowTabs from '../../../util/ArrowTabs';
import * as ROUTES from '../../../constants/routes';

const tabs = [
  {
    path: ROUTES.GOAL_LONG_TERM,
    name: 'College Major Strategy',
  },
  {
    path: ROUTES.GOAL_MID_TERM,
    name: 'Annual Planning',
  },
];

const PortfolioNav = () => <ArrowTabs tabs={tabs} className="mt-2" tabStyle={{ width: '260px' }} />;

export default PortfolioNav;
