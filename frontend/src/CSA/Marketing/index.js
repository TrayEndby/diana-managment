import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import VideoSection from './Video';
import FlyerSection from './Flyer';
import WebinarScheduleSection from './WebinarSchedule';
import WebinarDetailSection from './WebinarSchedule/WebinarScheduleDetail';
import SocialMediaBasics from './SocialMediaBasics';

import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const MarketingPage = () => {
  return (
    <Switch>
      <Route path={CSA_ROUTES.MARKET_VIDEO}>
        <VideoSection />
      </Route>
      <Route path={CSA_ROUTES.MARKET_FLYER}>
        <FlyerSection />
      </Route>
      <Route path={CSA_ROUTES.MARKET_WEBINAR}>
        <WebinarScheduleSection />
      </Route>
      <Route path={`${CSA_ROUTES.MARKET_WEBINAR_DETAIL}/:id`}>
        <WebinarDetailSection />
      </Route>
      <Route path={CSA_ROUTES.MARKET_SOCIAL_MEDIA}>
        <SocialMediaBasics />
      </Route>
      <Redirect to={CSA_ROUTES.HOME} />
    </Switch>
  );
};

MarketingPage.propTypes = propTypes;

export default MarketingPage;
