import React from 'react';

import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';

import { StyledFirebaseScreen } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from 'constants/routes';
import signinStyle from '../SignInStudent/style.module.scss';
import SignTabs from  '../../util/SignTabs';

const SignUpPage = () => (
  <section className={`App-body d-flex ${signinStyle.container}`}>
    <CardDeck className="mx-auto my-auto card-deck">
      <Card className="signIn-card left-side">
        <Jumbotron className="mb-0 h-100">
        </Jumbotron>
      </Card>
      <Card className="d-flex signIn-card right-side">
        <SignTabs title="student" type={1} />
        <div className="my-auto signIn-form">
          <div>
            <span className="signin-type mn-4">STUDENT </span>
            <span className="educator-signin mn-4">SIGN UP</span>
          </div>
          <SignInForm />
          <div className="signup-text">
            Already have an account? <Link className="signup-link" to={ROUTES.SIGN_IN}>Sign in</Link>
          </div>
          <div className="legal">
            <div>By continuing, you agree to our</div>
            <div>              
              <Link to={ROUTES.LEGAL_TERM}><strong className="legal-link">Terms of Service</strong></Link>
              &nbsp;and&nbsp;
              <Link to={ROUTES.LEGAL_PRIVACY}><strong className="legal-link">Privacy Policy</strong></Link>
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

export default SignUpPage;
