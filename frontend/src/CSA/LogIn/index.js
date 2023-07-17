import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';

import { StyledFirebaseScreen } from 'components/Firebase';

import style from './style.module.scss';
import CloseButton from "../../util/CloseButton"
import * as CSA_ROUTES from "constants/CSA/routes";
import { useHistory } from "react-router-dom";

const propTypes = {
  signup: PropTypes.bool,
};


const LogInCSA = ({ signup }) => {
  const history = useHistory();

  const handleClose = () => {
    history.push(CSA_ROUTES.MAIN_HOME);
  };
  return (
    <Container fluid className={style.container}>
      <div>
        <div className={style.box}>
          <CloseButton onClick={handleClose} dark className={style.close} />
          <p>RISE WITH KYROS</p>
          <h1>{signup ? 'CSA SIGN UP' : 'CSA LOG IN'}</h1>
          <StyledFirebaseScreen />
        </div>
      </div>
    </Container>
  )
}

LogInCSA.propTypes = propTypes;

export default LogInCSA;

