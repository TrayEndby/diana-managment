import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';

import CSAWebsitePage from './page';

import Body from 'util/Body';
import useErrorHandler from 'util/hooks/useErrorHandler';
import personalizedWebsiteService from 'service/CSA/PersonalizedWebsiteService';
import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const PersonalizedWebsite = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    const path = history.location.pathname;
    const alias = path.substring(`${CSA_ROUTES.WEBSITE}/`.length);
    personalizedWebsiteService.getUIDByAlias(alias)
    .then(setUserId)
    .catch(setError)
    .finally(() => {
      setLoading(false);
    })
  }, [history.location.pathname, setError]);

  return (
    <div>
      <Body loading={loading} error={error} className={cn({
        'App-text-white mt-3': loading
      })}>
        {user_id == null ?
          <h3 className="text-white text-center mt-3">CSA website not found</h3>
        : <CSAWebsitePage user_id={user_id} />}
      </Body>
    </div>
  );
};
PersonalizedWebsite.propTypes = propTypes;

export default PersonalizedWebsite;
