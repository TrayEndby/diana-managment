import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import Detail from '../Detail';

import * as ROUTES from '../../../constants/routes';
import collaborationService from '../../../service/CollaborationService';

const Create = ({ history }) => {
  const handleGoBack = () => {
    history.push(ROUTES.COLLABORATIONS);
  };

  const handleSubmit = async (data, pic) => {
    await collaborationService.createProject(data, pic);
    handleGoBack();
  };

  return (
    <Container fluid style={{ overflow: 'auto', paddingBottom: '1rem' }}>
      <Button variant="link" onClick={handleGoBack}>
        Back
      </Button>
      <Detail project={{}} editable={true} onSubmit={handleSubmit} onCancel={handleGoBack}/>
    </Container>
  );
};

export default withRouter(React.memo(Create));
