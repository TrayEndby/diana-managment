import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { STORAGE_SIGN_IN_TYPE } from "constants/storageKeys";
import { PROFILE_TYPE, PROFILE_TYPE_ID } from "constants/profileTypes";
import TheSidebar from "containers/TheSidebar";
import { AnalyticsComponent } from "./views/Firebase";
import { withFirebase } from "./views/Firebase";
import authService from "service/AuthService";
import userProfilePicService from "service/UserProfilePicService";
import SignInPage, { VerifyEmail } from "views/SignIn";
import UserSignUpPage from "views/UserSignUp";
import UserTransactionPage from "views/UserTransaction";
import EventRegistration from "views/EventRegistration";
import MailingListPage from "views/MailingList";
import MailingListDetailPage from "views/MailingList/MailingListDetail";
import EmailCreatePage from "views/Email/Create";
import EmailTemplatePage from "views/Email/Template";
import TemplateCreatePage from "views/Email/TemplateCreate";
import EmailDraftPage from "views/Email/Draft";
import EmailDraftDetailPage from "views/Email/DraftDetail";
import ContentEventPage from "views/ContentManagement/Events";
import SpeakersPage from "views/ContentManagement/Speakers";
import { version } from "constants/version";
import * as ADMIN_ROUTES from "./routes";
import "./scss/style.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticating: true,
      authUser: null,
      authedAs: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      this.handleAuthentication
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

    let authedAs = {
      emailVerified: true,
      avatar: null,
      hasProfile: false,
      userType: null,
    };
    try {
      // TODO: use a generic admin user type.
      const signInType =
        localStorage.getItem(STORAGE_SIGN_IN_TYPE) ||
        PROFILE_TYPE.EventEmailAdmin;
      if (authUser !== null) {
        await authService.verify(authUser, signInType);
        authedAs.hasProfile = authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.DataAdmin]) ||
          authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.AccountAdmin]) ||
          authService.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.EventEmailAdmin]);
        if (authedAs.hasProfile) {
          authedAs.avatar = await userProfilePicService.download();
          authedAs.userType = signInType;
        }
      }
    } catch (e) {
      console.error("error", e);
      if (authUser.emailVerified === false) {
        // when email not verified
        authedAs.emailVerified = false;
      } else {
        authUser = null;
      }
    } finally {
      this.setState({
        authUser: authUser || null,
        authenticating: false,
        authedAs: authedAs,
      });
    }
  };

  render() {
    const { authenticating, authUser, authedAs } = this.state;

    if (authenticating) {
      return <div />;
    }
    const authenticated = authUser != null;
    const routeProps = {
      authenticated,
      authedAs,
    };

    const ProfileImageContext = React.createContext("");
    return (
      <ProfileImageContext.Provider value="ToBeUsed">
        <Router>
          <AnalyticsComponent />
          <div className="c-app c-default-layout">
            <TheSidebar />
            <Switch>
              <Route exact path={ADMIN_ROUTES.LOGIN} component={SignInPage} />
              <PrivateRoute
                path={ADMIN_ROUTES.USER_SIGN_UP}
                component={UserSignUpPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.EVENT_REGISTRAION}
                component={EventRegistration}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.USER_TRANSACTION}
                component={UserTransactionPage}
                {...routeProps}
              />
              <PrivateRoute
                path={`${ADMIN_ROUTES.MAILING_LIST}/:id`}
                component={MailingListDetailPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.MAILING_LIST}
                component={MailingListPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.EMAIL_CREATE}
                component={EmailCreatePage}
                {...routeProps}
              />
              <PrivateRoute
                path={`${ADMIN_ROUTES.EMAIL_CREATE}/:name`}
                component={EmailCreatePage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.EMAIL_TEMPLATE}
                component={EmailTemplatePage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.EMAIL_CREATE_TEMPLATE}
                component={TemplateCreatePage}
                {...routeProps}
              />
              <PrivateRoute
                path={`${ADMIN_ROUTES.EMAIL_UPDATE_TEMPLATE}/:name`}
                component={TemplateCreatePage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.EMAIL_DRAFT}
                component={EmailDraftPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.EMAIL_DRAFT_DETAIL}
                component={EmailDraftDetailPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.CONTENT_EVENTS}
                component={ContentEventPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ADMIN_ROUTES.CONTENT_SPEAKERS}
                component={SpeakersPage}
                {...routeProps}
              />
              <Redirect to={ADMIN_ROUTES.USER_SIGN_UP} />
            </Switch>
          </div>
        </Router>
      </ProfileImageContext.Provider>
    );
  }
}

function PrivateRoute({
  component: Component,
  authenticated,
  authedAs,
  ...rest
}) {
  const HOComponent = (props) => {
    if (!authenticated) {
      return <Redirect to={{ pathname: ADMIN_ROUTES.LOGIN }} />;
    }
    if (authedAs && authedAs.emailVerified === false) {
      return <VerifyEmail />;
    }

    return (
      <StudentRoute
        {...props}
        {...rest}
        authedAs={authedAs}
        component={Component}
      />
    );
  };
  return <Route {...rest} render={HOComponent} />;
}

function StudentRoute({
  component: Component,
  authedAs,
  ...rest
}) {
  const HOComponent = (props) => {
    if (authedAs.hasProfile) {
      return <Component {...props} authedAs={authedAs} />;
    } else {
      return <Redirect to={{ pathname: ADMIN_ROUTES.LOGIN }} />;
    }
  };
  return <Route {...rest} render={HOComponent} />;
}

export default withFirebase(App);
