import React from 'react';
import cn from 'classnames';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import MonthChart from './MonthChart';
import { withRouter } from 'react-router-dom';

import MonthsGraph from './MonthsGraph';
import { getCurrentMonth, getMonth } from './helper';
import BackButton from '../utils/BackButton';
import ChildLabel from '../utils/ChildLabel';
import styles from './style.module.scss';

const currentMonth = getCurrentMonth();

const ranges = {
  '3m': {
    start: { week: 1, month: getMonth(currentMonth - 1) },
    end: { week: 4, month: getMonth(currentMonth + 1) },
  },
  '6m': {
    start: { week: 1, month: getMonth(currentMonth - 2) },
    end: { week: 4, month: getMonth(currentMonth + 3) },
  },
  '9m': {
    start: { week: 1, month: getMonth(currentMonth - 4) },
    end: { week: 4, month: getMonth(currentMonth + 4) },
  },
  ytd: { start: { week: 1, month: 1 }, end: { week: 4, month: 12 } },
};

const propTypes = {};

const ProgressReport = withRouter(
  React.memo(({ history }) => {
    // '3m' | '6m' | '9m' | 'YTD' | '4Y'
    const [tabKey, selectTabKey] = React.useState('3m');
    return (
      <div className={cn('App-body', styles.container)}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContainerLeft}>
            <BackButton />
            <div className={styles.title}>MY PROGRESS</div>
          </div>
          <ChildLabel />
        </div>
        <MonthsGraph />
        <Container className="labels-container text-white text-center">
          <Container className="second-graph">
            <Tabs
              variant="pills"
              defaultActiveKey="3m"
              id="uncontrolled-tab-example"
              className="tabs mt-4"
              activeKey={tabKey}
              onSelect={selectTabKey}
            >
              {['3m', '6m', '9m', 'ytd'].map((rangeKey) => (
                <Tab
                  key={rangeKey}
                  eventKey={rangeKey}
                  title={rangeKey}
                  className="mt-4"
                >
                  <MonthChart
                    startMonth={ranges[rangeKey].start}
                    endMonth={ranges[rangeKey].end}
                    rangeKey={rangeKey}
                  />
                </Tab>
              ))}
              <Tab eventKey="4y" title="4y" className="mt-4">
                <MonthChart rangeKey="4y" />
              </Tab>
            </Tabs>
          </Container>
        </Container>
      </div>
    );
  }),
);

ProgressReport.propTypes = propTypes;

export default ProgressReport;
