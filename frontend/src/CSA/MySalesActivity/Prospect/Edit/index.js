import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Container from 'CSA/Container';
import Back from '../Back';
import Form from '../Form';

import useErrorHandler from 'util/hooks/useErrorHandler';
import Body from 'util/Body';
import prospectService from 'service/CSA/ProspectService';
import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

const ProspectEditSection = ({ match, history }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useErrorHandler();
  const [prospect, setProspect] = useState(null);
  const id = match.params.id;

  useEffect(() => {
    setLoading(true);
    prospectService
      .getById(id)
      .then((res) => {
        if (res && Object.keys(res).length > 0) {
          setProspect(res);
        } else {
          throw new Error("Prospect doesn't exist");
        }
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [id, setError]);

  return (
    <Container title="Prospecting" className="App-body">
      <Back text='My prospect list' path={CSA_ROUTES.SALES_PROSPECT} />
      <Body loading={loading} error={error}>
        {error == null && <Form data={prospect} onSubmit={() => { history.push(CSA_ROUTES.SALES_PROSPECT) }}/>}
      </Body>
    </Container>
  );
};

ProspectEditSection.propTypes = propTypes;

export default withRouter(ProspectEditSection);
