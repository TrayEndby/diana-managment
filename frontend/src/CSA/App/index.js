import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import './style.scss';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import RegistrationSuccessPage from '../RegistrationSuccess';
import MainHome from "../MainHome"
import HomePage from '../Home';
import RegisterForm from '../RegistrationForm';
import ConfirmationPage from '../ConfirmationPage';
import AgreementPage from '../NewCSA/Agreement';
import PoliciesPage from '../NewCSA/Policies';
import CheckListPage from '../NewCSA/CheckList';
import CodeOfEthicsPage from '../NewCSA/CodeOfEthics';
import EULA from '../NewCSA/EULA';
import Privacy from '../NewCSA/Privacy';
import LoginPage from '../LogIn';
import ProfilePage from '../Profile';
import CalendarPage from '../Calendar';
import MyContactsPage from '../MyContacts';
import MyContactsCustomersPage from '../MyContacts/MyCustomer';
import MyContactsTeamPage from '../MyContacts/MyTeam';
import MarketingPage from '../Marketing';
import MyEarningsPage from '../MyEarnings';
import MySalesActivityPage from '../MySalesActivity';
import MyBusinessPage from '../MyBusiness';
import PersonalizedWebsite from '../PersonalizedWebsite';

import TrainingVideo from '../Community/Training/TrainingVideos';
import SalesDecks from '../Community/Training/SalesDecks';
import TrainingWebinarsPage from '../Community/Training/TrainingWebinars';
import TrainingWebinarsDetailPage from '../Community/Training/TrainingWebinars/TrainingWebinarScheduleDetail';

import ProductUpdatesPage from '../ProductUpdates';
import ProductDetailPage from '../ProductUpdates/Detail';

import ScheduleAppointmentPage from 'components/ScheduleAppointment';
import TermPage from 'components/Legal/Term';
import PrivacyPage from 'components/Legal/Privacy';
import VerifyEmail from 'components/SignInStudent/Verify';
import { withFirebase } from 'components/Firebase';

import Spinner from 'util/Spinner';
import HomeRedirectRoute from 'util/HOC/HomeRedirectRoute';

import authService from 'service/AuthService';
import profileService from 'service/CSA/ProfileService';
import calendarService from 'service/CalendarService';
import socketService from 'service/SocketService';

import { version } from 'constants/version';
import { PROFILE_TYPE, PROFILE_TYPE_ID } from 'constants/profileTypes';
import * as ROUTES from 'constants/routes';
import * as CSA_ROUTES from 'constants/CSA/routes';

const propTypes = {};

class CSAApp extends Component {
  constructor() {
    super();
    this.state = {
      authenticating: true,
      authUser: null,
      hasProfile: null,
      emailVerified: false,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      this.handleAuthentication,
    );
    console.info(`Kyros.ai version: ${version}`);
  }

  componentWillUnmount() {
    this.listener();
  }

  handleAuthentication = async (authUser) => {
    this.setState({
      authenticating: true,
    });
    let hasProfile = null;
    let emailVerified = true;
    let userVerified = true;
    try {
      if (authUser !== null) {
        await authService.verify(authUser, PROFILE_TYPE.CSA);
        hasProfile = await profileService.hasProfile();
        userVerified = authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.CSA]);
        await this.initialize();
      }
    } catch (e) {
      console.error(e);
      if (authUser.emailVerified === false) {
        // when email not verified
        emailVerified = false;
      } else {
        authUser = null;
      }
    } finally {
      this.setState({
        authUser: authUser || null,
        authenticating: false,
        hasProfile,
        emailVerified,
        userVerified,
      });
    }
  };

  initialize = async () => {
    try {
      socketService.connect();
      await calendarService.fetchEnums();
    } catch (e) {
      console.error(e);
    }
  };

  refreshProfile = async () => {
    try {
      // The user type need to be updated in the JWT after the profile is finished.
      await authService.verify(authService.getUser(), PROFILE_TYPE.CSA);
      const hasProfile = await profileService.hasProfile();
      this.setState({ hasProfile });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const {
      authenticating,
      authUser,
      hasProfile,
      emailVerified,
      userVerified,
    } = this.state;
    if (authenticating) {
      return <Spinner />;
    }
    const authenticated = authUser != null;
    const routeProps = {
      authenticated,
      hasProfile,
      emailVerified,
      userVerified,
    };
    return (
      <Router>
        <div className="App d-flex flex-column">
          <Navigation authUser={authUser} {...routeProps} />
          <Switch>
            <Route path={ROUTES.LEGAL_TERM} component={TermPage} />
            <Route path={ROUTES.LEGAL_PRIVACY} component={PrivacyPage} />
            <PrivateRoute
              path={CSA_ROUTES.HOME}
              component={HomePage}
              {...routeProps}
            />
            <PrivateRoute path={CSA_ROUTES.PROFILE} {...routeProps}>
              <ProfilePage unverified={!userVerified} />
            </PrivateRoute>
            <PrivateRoute
              path={CSA_ROUTES.CALENDAR}
              component={CalendarPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.MY_CONTACTS}
              component={MyContactsPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.MY_EARNINGS}
              component={MyEarningsPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.SALES}
              component={MySalesActivityPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.MY_CONTACTS_CUSTOMERS}
              component={MyContactsCustomersPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.MY_CONTACTS_TEAM}
              component={MyContactsTeamPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.MARKETING}
              component={MarketingPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.TRAINING_VIDEO}
              component={TrainingVideo}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.SALES_DECKS}
              component={SalesDecks}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.TRAINING_WEBINARS}
              component={TrainingWebinarsPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.PRODUCT_UPDATES}
              component={ProductUpdatesPage}
              {...routeProps}
            />
            <PrivateRoute
              path={`${CSA_ROUTES.PRODUCT_UPDATES_DETAIL}/:id`}
              component={ProductDetailPage}
              {...routeProps}
            />
            <PrivateRoute
              path={`${CSA_ROUTES.TRAINING_WEBINARS_DETAIL}/:id`}
              component={TrainingWebinarsDetailPage}
              {...routeProps}
            />
            <PrivateRoute path={CSA_ROUTES.REGISTRATION_FORM} {...routeProps}>
              <RegisterForm onSubmit={this.refreshProfile} />
            </PrivateRoute>
            <PrivateRoute path={CSA_ROUTES.AGREEMENT} {...routeProps}>
              <AgreementPage />
            </PrivateRoute>
            <PrivateRoute
              path={CSA_ROUTES.CHECKLIST}
              component={CheckListPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.EULA}
              component={EULA}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.PRIVACY}
              component={Privacy}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.CODEOFETHICS}
              component={CodeOfEthicsPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.POLICIES}
              component={PoliciesPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.CONFIRMATION_PAGE}
              component={ConfirmationPage}
              {...routeProps}
            />
            <PrivateRoute
              path={CSA_ROUTES.MY_BUSINESS}
              component={MyBusinessPage}
              {...routeProps}
            />
            <HomeRedirectRoute
              path={CSA_ROUTES.SIGN_UP}
              authenticated={authenticated}
            >
              <LoginPage signup />
            </HomeRedirectRoute>
            <HomeRedirectRoute
              path={CSA_ROUTES.LOG_IN}
              component={LoginPage}
              authenticated={authenticated}
            />
            <HomeRedirectRoute
              path={CSA_ROUTES.LANDING}
              exact
              component={LandingPage}
              authenticated={authenticated}
            />
            <RegistrationSuccessPage
              path={CSA_ROUTES.REGISTRATION_SUCCESS}
              exact
              component={RegistrationSuccessPage}
              authenticated={authenticated}
            />
            <HomeRedirectRoute
              path={CSA_ROUTES.MAIN_HOME}
              exact
              component={MainHome}
              authenticated={authenticated}
            />
            <Route path={CSA_ROUTES.WEBSITE} component={PersonalizedWebsite} />
            <Route
              path={CSA_ROUTES.APPOINTMENT}
              component={ScheduleAppointmentPage}
            />
            <Route
              path={CSA_ROUTES.REGISTRATION_FORM}
              component={RegisterForm}
            />
            <Route
              path={CSA_ROUTES.CONFIRMATION_PAGE}
              component={ConfirmationPage}
            />
            <Route path={CSA_ROUTES.SIGN_UP} authenticated={authenticated}>
              <LoginPage signup />
            </Route>
            <Route
              path={CSA_ROUTES.LOG_IN}
              component={LoginPage}
              authenticated={authenticated}
            />
            <Route
              path={CSA_ROUTES.LANDING}
              exact
              component={LandingPage}
              authenticated={authenticated}
            />
            <Redirect to={CSA_ROUTES.MAIN_HOME} />
          </Switch>
        </div>
      </Router>
    );
  }
}

function PrivateRoute({
  component: Component,
  emailVerified,
  userVerified,
  authenticated,
  hasProfile,
  ...rest
}) {
  const HOComponent = (props) => {
    if (emailVerified === false) {
      return <VerifyEmail />;
    }
    if (!authenticated) {
      return <Redirect to={{ pathname: CSA_ROUTES.MAIN_HOME }} />;
    }
    if (!hasProfile) {
      return <Redirect to={{ pathname: CSA_ROUTES.REGISTRATION_FORM }} />;
    }
    if (!userVerified) {
      return <Redirect to={{ pathname: CSA_ROUTES.PROFILE }} />;
    }
    return <Component {...props} {...rest} />;
  };
  return rest.children ? (
    <Route {...rest} />
  ) : (
      <Route {...rest} render={HOComponent} />
    );
}

CSAApp.propTypes = propTypes;

export default withFirebase(CSAApp);
