import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Layout from '../Layout';
import Overview from './Overview';
import AnnualPlan from './AnnualPlan';

import Loading from '../../../util/Loading';
import ErrorDialog from '../../../util/ErrorDialog';
import useErrorHandler from '../../../util/hooks/useErrorHandler';
import strategyService from '../../../service/StrategyService';
import * as ROUTES from '../../../constants/routes';

const propTypes = {};

const MidTermSection = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [overviews, setOverViews] = useState([]);

  const topBar = (
    <>
      <Col>
        {history.location.pathname.includes(ROUTES.GOAL_MID_TERM_GRADE) && (
          <Button onClick={() => history.push(ROUTES.GOAL_MID_TERM)}>Back</Button>
        )}
      </Col>
      <Col>
        <h5 style={{ height: '50px', lineHeight: '50px', whiteSpace: 'nowrap' }}>4 Yeah High School Plan</h5>
      </Col>
      <Col></Col>
    </>
  );

  const fetchAnnualPlan = React.useCallback(async (grade) => {
    setError(null);
    try {
      return strategyService.getAnnualPlanByGrade(grade);
    } catch (e) {
      setError(e);
    }
  }, [setError]);

  useEffect(() => {
    strategyService
      .getAllAnnualPlans()
      .then((res) => {
        setOverViews(res);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setError]);

  return (
    <div className="h-100 overflow-auto">
      <ErrorDialog error={error} />
      <Loading show={loading} className="text-white" />
      {!loading && (
        <Layout customTopBar={topBar}>
          <Switch>
            <Route exact path={ROUTES.GOAL_MID_TERM}>
              <Overview overviews={overviews} />
            </Route>
            <Route path={`${ROUTES.GOAL_MID_TERM_GRADE}/:id`}>
              <AnnualPlan onFetch={fetchAnnualPlan} />
            </Route>
            <Redirect to={ROUTES.GOAL_MID_TERM} />
          </Switch>
        </Layout>
      )}
    </div>
  );
};

MidTermSection.propTypes = propTypes;

export default React.memo(withRouter(MidTermSection));
