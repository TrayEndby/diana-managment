import React from 'react';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import MissionTrackingIcon from 'assets/menus/MissionTracking.svg';
import ProgressReportIcon from 'assets/menus/ProgressReport.svg';
import MyPortfolioIcon from 'assets/menus/MyPortfolio.svg';
import BenchmarkIcon from 'assets/menus/Benchmark_Chancing.svg';

import Card from 'react-bootstrap/Card';

import * as ROUTES from 'constants/routes';
import styles from './style.module.scss';
import ChildDropdown from '../utils/ChildDropdown';

const propTypes = {};

const menus = [
  {
    text: 'Mission Tracking',
    icon: MissionTrackingIcon,
    path: ROUTES.MISSION_TRACKING,
  },
  {
    text: 'Progress Report',
    icon: ProgressReportIcon,
    path: ROUTES.PROGRESS_REPORT,
  },
  {
    text: 'My Portfolio vs Sample Resume',
    description: 'Qualitative Analysis',
    icon: MyPortfolioIcon,
    path: ROUTES.PORTFOLIO,
  },
  {
    text: 'Benchmark & Chancing',
    description: 'Quantitative Analysis',
    icon: BenchmarkIcon,
    path: ROUTES.BENCHMARK_AND_CHANCING,
  },
];

const MyProgressNavCard = () => {
  const history = useHistory();
  return (
    <div className={cn('App-body', styles.container)}>
      <ChildDropdown className="progress-page" />
      {menus.map((menu, index) => (
        <Card
          key={index}
          className={styles.card}
          onClick={() => history.push(menu.path)}
        >
          <div className={styles.title}>{menu.text}</div>
          {menu.description && (
            <div className={styles.description}>{menu.description}</div>
          )}
          <img src={menu.icon} alt={menu.text} />
        </Card>
      ))}
    </div>
  );
};

MyProgressNavCard.propTypes = propTypes;

export default MyProgressNavCard;
