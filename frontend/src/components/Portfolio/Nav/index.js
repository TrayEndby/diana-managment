import React from 'react';
import cn from 'classnames';

import { ReactComponent as CourseIcon } from 'assets/menus/Courses.svg';
import { ReactComponent as TestPrepIcon } from 'assets/menus/TestPrep.svg';
import { ReactComponent as ECAIcon } from 'assets/menus/ECA.svg';
import { ReactComponent as AchievementsIcon } from 'assets/menus/Achievements.svg';
import { ReactComponent as AdditionalInfoIcon } from 'assets/menus/AdditionalInfo.svg';

import Tabs from 'util/Tabs';
import * as ROUTES from 'constants/routes';

import styles from './style.module.scss';

const TabContent = ({ Icon, name, lineOnly }) => (
  <>
    <Icon className={cn('image', { lineOnly })} />
    {name}
  </>
);

const tabs = [
  {
    path: ROUTES.PORTFOLIO_COURSE,
    render: () => <TabContent Icon={CourseIcon} name="Courses" />,
  },
  {
    path: ROUTES.PORTFOLIO_TEST,
    render: () => <TabContent Icon={TestPrepIcon} name="Tests" lineOnly />,
  },
  {
    path: ROUTES.PORTFOLIO_ECA,
    render: () => <TabContent Icon={ECAIcon} name="Extracurriculars" />,
  },
  {
    path: ROUTES.PORTFOLIO_ACHIEVEMENT,
    render: () => <TabContent Icon={AchievementsIcon} name="Achievements" />,
  },
  {
    path: ROUTES.PORTFOLIO_SUPPLEMENTARY,
    render: () => (
      <TabContent Icon={AdditionalInfoIcon} name="Additional info" />
    ),
  },
];

const PortfolioNav = () => <Tabs tabs={tabs} className={styles.tabs} />;

export default PortfolioNav;
