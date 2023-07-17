import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import * as CSA_ROUTES from 'constants/CSA/routes';
import bgImage from 'assets//CSA//Landing//CSA-Header.png';
import styles from './style.module.scss';

const RegistrationSuccessPage = () => {
  const history = useHistory();
  return (
    <Container
      fluid
      className="d-flex flex-row justify-content-center align-items-start header-background"
    >
      <img className="responsive top-section" src={bgImage} alt="bgImage"></img>
      <div className={styles.form}>
        <div className={styles.kyrosContent1}>
          <span style={{ color: 'black' }}>Thank you</span> for<br/>your interest in
          our<br/>CSA program!
        </div>
        <div className={styles.kyrosContent2}>
          You will receive a confirmation email momentarily with next steps.
        </div>
        <div className={styles.kyrosContent3}>
          *Please check your Promotion or Junk folder in case you can't find our
          email in your inbox.
        </div>
        <div>
          <Button className={styles.becomeButton} onClick={()=>history.push(CSA_ROUTES.LOG_IN)}>Become a CSA</Button>
        </div>
      </div>
    </Container>
  );
};

export default RegistrationSuccessPage;
