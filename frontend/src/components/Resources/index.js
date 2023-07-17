import React, { useEffect, useState } from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import Search from './Search';
import Detail from './Detail';
import AudioPlayer from './AudioPlayer';

import Tabs from 'util/Tabs';
import { Resource_Type } from 'service/ResourceService';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

const propTypes = {};

const tabs = [
  {
    name: 'Podcasts',
    path: ROUTES.RESOURCES_PODCASTS,
  },
  {
    name: 'Tips & Guidance',
    path: ROUTES.RESOURCES_ARTICLES,
  },
];

const ResourcesPage = (history) => {
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    setPodcast(null);
  }, [history.location]);

  return (
    <div className={classNames('App-body', style.container)}>
      <Tabs tabs={tabs} className={style.tabs} />
      <Switch>
        <Route path={`${ROUTES.RESOURCES_PODCASTS_DETAIL}/:id`}>
          <Detail type={Resource_Type.Podcast} onListenPodcast={setPodcast} />
        </Route>
        <Route path={`${ROUTES.RESOURCES_ARTICLES_DETAIL}/:id`}>
          <Detail type={Resource_Type.Article} />
        </Route>
        <Route exact path={ROUTES.RESOURCES_PODCASTS}>
          <Search
            type={Resource_Type.Podcast}
            title="Search podcasts"
            onListenPodcast={setPodcast}
          />
        </Route>
        <Route exact path={ROUTES.RESOURCES_ARTICLES}>
          <Search
            type={Resource_Type.Article}
            title="Search tips and guidance"
          />
        </Route>
        <Redirect to={ROUTES.RESOURCES_PODCASTS} />
      </Switch>
      {podcast && <AudioPlayer podcast={podcast} />}
    </div>
  );
};

ResourcesPage.propTypes = propTypes;

export default withRouter(ResourcesPage);
