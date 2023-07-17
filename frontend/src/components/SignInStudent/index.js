import React from 'react';

import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { StyledFirebaseScreen } from '../Firebase';
import VerifyEmail from './Verify';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import styles from './style.module.scss';
import SignTabs from  '../../util/SignTabs';

const SignInPage = () => (
  <section className={`App-body d-flex ${styles.container}`}>
    <CardDeck className="mx-auto my-auto card-deck">
      <Card className="signIn-card left-side">
        <Jumbotron className="mb-0 h-100">
        </Jumbotron>
      </Card>
      <Card className="d-flex signIn-card right-side">
        <SignTabs title="student" type={0} />
        <div className="my-auto signIn-form">
          <div>
            <span className="signin-type mn-4">STUDENT </span>
            <span className="educator-signin mn-4">SIGN IN</span>
          </div>
          <SignInForm />
          <div className="signup-text">
            No account? <Link className="signup-link" to={ROUTES.SIGN_UP}>Create one</Link>
          </div>
          <div className="legal">
            <div>By continuing, you agree to our</div>
            <div>
              <Link
                to={ROUTES.LEGAL_TERM}
                className="legal-link"
                target="__blank"
              >
                {' '}
                Terms of Service{' '}
              </Link>
              &nbsp;and&nbsp;
              <Link
                to={ROUTES.LEGAL_PRIVACY}
                className="legal-link"
                target="__blank"
              >
                {' '}
                Privacy Policy{' '}
              </Link>              
            </div>
          </div>
        </div>
      </Card>
    </CardDeck>
  </section>
);

const SignInForm = () => {
  return <StyledFirebaseScreen />;
};

export default SignInPage;

export { VerifyEmail };
