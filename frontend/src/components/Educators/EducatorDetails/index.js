import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import style from './style.module.scss';
import Tabs from '../../../util/Tabs';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import EducatorInfoSidebar from '../EducatorInfoSidebar';
import EducatorAbout from './EducatorAbout';
import ServiceRequests from './ServiceRequests';
import { parseSearchParams, getPathWithSearchParam } from '../../../util/helpers';
import EducatorFeedback from './EducatorFeedback';
import EducatorCalendar from '../EducatorDetails/ServiceRequests/Calendar';
import { PROFILE_TYPE } from '../../../constants/profileTypes';
import cn from 'classnames';

const Nav = ({ authedAs }) => {
  const educatorTabs = [
    {
      path: ROUTES.EDUCATOR_DETAILS_ABOUT,
      name: 'About me',
    },
    {
      path: ROUTES.EDUCATOR_DETAILS_FEEDBACK,
      name: 'Feedback',
    },
    {
      path: ROUTES.EDUCATOR_DETAILS_SERVICE_REQUESTS,
      name: 'Service requests',
    },
  ];

  const studentTabs = [
    {
      path: ROUTES.EDUCATOR_DETAILS_ABOUT,
      name: 'About me',
    },
    {
      path: ROUTES.EDUCATOR_DETAILS_FEEDBACK,
      name: 'Feedback',
    },
    {
      path: ROUTES.EDUCATOR_DETAILS_SHEDULE_SERVICE,
      name: 'Schedule service',
    },
  ];

  if (authedAs.userType === PROFILE_TYPE.Educator) {
    return <Tabs tabs={educatorTabs} keepSearchParam />;
  }

  return <Tabs tabs={studentTabs} keepSearchParam />;
};

const EducatorDetails = ({ authedAs }) => {
  const history = useHistory();
  const isEducatorLogin = authedAs.userType === PROFILE_TYPE.Educator;
  const [isEducator, setIsEducator] = React.useState(authedAs.userType === PROFILE_TYPE.Educator);
  const [educatorId, setEducatorId] = React.useState(undefined);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    setIsEducator(isEducatorLogin);
    const { id } = parseSearchParams(history.location.search);
    setEducatorId(id);
  }, [history.location.search, isEducatorLogin]);

  const handleClose = () => {
    setIsCollapsed(true)
  }

  const handleOpen = () => {
    setIsCollapsed(false)
  }
  return (
    <div className="App-body">
      <Container fluid className={style.container}>
        <Row className={style.row} noGutters>
          <div className={cn(style.sidebar, { [style.collapsed]: isCollapsed })}>
            <EducatorInfoSidebar
              isEducator={isEducator}
              educatorId={educatorId}
              handleOpen={handleOpen}
              handleClose={handleClose}
              isCollapsed={isCollapsed}
            />
          </div>
          <div className={cn(style.tabContainer, { [style.collapsed]: isCollapsed })}>
            <Nav authedAs={authedAs} />
            <div className={style.tabContent}>
              <Switch>
                <Route path={ROUTES.EDUCATOR_DETAILS_SHEDULE_SERVICE}>
                  <EducatorCalendar isEducator={isEducator} educatorId={educatorId} />
                </Route>
                <Route path={ROUTES.EDUCATOR_DETAILS_SERVICE_REQUESTS}>
                  <ServiceRequests isEducator={isEducator} educatorId={educatorId} />
                </Route>
                <Route path={ROUTES.EDUCATOR_DETAILS_FEEDBACK}>
                  <EducatorFeedback isEducator={isEducator} educatorId={educatorId} />
                </Route>
                <Route path={ROUTES.EDUCATOR_DETAILS_ABOUT}>
                  <EducatorAbout isEducator={isEducator} educatorId={educatorId} />
                </Route>
                <Redirect to={getPathWithSearchParam(ROUTES.EDUCATOR_DETAILS_ABOUT, history)} />
              </Switch>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default EducatorDetails;
