import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { Provider } from 'react-redux';
// Let global css apply first, then module css can take over
// import style.scss in this line is important, please don't move it
import './style.scss';

import store from './store';
import { AnalyticsComponent } from '../Firebase';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import LeadFormPage from '../LeadForm';
import HomePage from '../Home';
import SignInStudent, { VerifyEmail } from '../SignInStudent';
import SignUpStudent from '../SignupStudent';
import SignInEducatorPage from '../SigninEducator';
import SignUpEducatorPage from '../SignupEducator';
import SignInParentPage from '../SignInParent';
import SignUpParentPage from '../SignupParent';
import Questionnaire from '../Questionnaire';
import ParentQuestionnaire from '../ParentQuestionnaire';
import ParentProfile from '../ParentQuestionnaire/ParentProfile';
import MyProfile from '../Questionnaire/MyProfile';
import MyContacts from '../MyContacts';
import PublicProfile from '../PublicProfile';
import Calendar from '../Calendar';

import TermPage from '../Legal/Term';
import PrivacyPage from '../Legal/Privacy';
import EULA from '../Legal/EULA';

import FAQ from "../FAQ"

import GoalSettingPage from '../GoalSetting';
import TasksManagerPage from '../TasksManager';
import CoursePage from '../Course';
import CollegePage from '../College';
import EssayPage from '../Essay';
import TestPrepPage from '../TestPrep';
import MyEvolution from '../MyEvolution';

import { withFirebase } from '../Firebase';
import ActivitiesPage from '../Activities';
import AdmissionsPage from '../Admissions';
import FinAidPage from '../FinancialAid';
import EducatorsProfile from '../Educators/EducatorProfile';
import EducatorDetails from '../Educators/EducatorDetails';
import ResourcesPage from '../Resources';
import MyHomeworkPage from '../MyHomeworkPage';
import MyConversationsPage from 'pages/MyConversations';
import MyProgressPage from 'pages/MyProgress';
import FindEducatorPage from 'pages/FindEducator';

import Payment from '../Payment';
import Subscription from '../Payment/Subscription';

import WebinarSchedulePage from '../WebinarSchedule';
import WebinarDetailPage from '../WebinarSchedule/WebinarScheduleDetail';
import SprintProgramPage from '../SprintProgram';
import SprintProgramDetailPage from '../SprintProgram/SprintProgramDetail';
import MonthlyCounselingPage from '../MonthlyCounseling';
import MonthlyCounselingDetailPage from '../MonthlyCounseling/MonthlyCounselingDetail';

import Spinner from 'util/Spinner';
import HomeRedirectRoute from 'util/HOC/HomeRedirectRoute';
import authService from 'service/AuthService';
import userProfileSearchService from 'service/UserProfileSearchService';
import socketService from 'service/SocketService';
import calendarService from 'service/CalendarService';
import userProfilePicService from 'service/UserProfilePicService';
import ProductBrochure from 'components/ProductBrochure';
import ServiceBrochure from 'components/ServiceBrochure';

import { version } from 'constants/version';
import { PROFILE_TYPE, PROFILE_TYPE_ID } from 'constants/profileTypes';
import * as ROUTES from 'constants/routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticating: true,
      authUser: null,
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
    let authedAs = {
      userType: null,
      hasProfile: null,
      emailVerified: true,
      avatar: null,
      userVerified: true,
    };
    const signInType = authService.getSignInType();
    try {
      if (authUser !== null) {
        await authService.verify(authUser, signInType);
        const type_id = PROFILE_TYPE_ID[signInType];
        if (type_id == null) {
          alert('Not supported!');
          return;
        } else if (signInType === PROFILE_TYPE.Educator) {
          const hasEducatorProfile = await userProfileSearchService.hasEducatorProfile();
          authedAs.userType = PROFILE_TYPE.Educator;
          authedAs.hasProfile = hasEducatorProfile;
        } else {
          authedAs.userType = signInType;
          authedAs.hasProfile = await userProfileSearchService.hasProfileType(
            signInType,
          );
        }
        authedAs.userVerified = authService.isVerified(type_id);
        await this.initialize();
        authedAs.avatar = await userProfilePicService.download();
      }
    } catch (e) {
      console.error(e);
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
        authedAs,
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

  updateProfile = async () => {
    const authedAs = { ...this.state.authedAs };
    try {
      // The user type need to be updated in the JWT after the profile is finished.
      await authService.verify(authService.getUser(), authedAs.userType);
      if (authedAs.userType === PROFILE_TYPE.RegularHSStudent) {
        const hasStudentProfile = await userProfileSearchService.hasProfile();
        authedAs.hasProfile = hasStudentProfile;
      }
      if (authedAs.userType === PROFILE_TYPE.Parent) {
        const hasParentProfile = await userProfileSearchService.hasParentProfile();
        authedAs.hasProfile = hasParentProfile;
      }

      if (authedAs.userType === PROFILE_TYPE.Educator) {
        const hasEducatorProfile = await userProfileSearchService.hasEducatorProfile();
        authedAs.hasProfile = hasEducatorProfile;
      }
      const type_id = PROFILE_TYPE_ID[authedAs.userType];
      authedAs.userVerified = authService.isVerified(type_id);
      this.setState({
        ...this.state,
        authedAs,
      });
    } catch (e) {
      console.error(e);
    }
  };

  handleUploadAvatar = async (pic) => {
    try {
      await userProfilePicService.upload(pic);
      this.setState({
        authedAs: {
          ...this.state.authedAs,
          avatar: URL.createObjectURL(pic),
        },
      });
    } catch (e) {
      console.error(e);
      alert('Upload profile image failed');
    }
  };

  render() {
    const { authenticating, authUser, authedAs } = this.state;
    if (authenticating) {
      return <Spinner />;
    }
    const authenticated = authUser != null;
    const routeProps = {
      authenticated,
      authedAs,
    };

    return (
      <Provider store={store}>
        <Router>
          <AnalyticsComponent />
          <div className="App d-flex flex-column">
            <Navigation authUser={authUser} authedAs={authedAs} />
            <Switch>
              <Route
                path={ROUTES.PRODUCT_BROCHURE}
                component={ProductBrochure}
                exact
              />
              <Route
                path={ROUTES.SERVICE_BROCHURE}
                component={ServiceBrochure}
                exact
              />
              <Route path={ROUTES.LEGAL_TERM} component={TermPage} />
              <Route path={ROUTES.LEGAL_PRIVACY} component={PrivacyPage} />
              <Route path={ROUTES.LEGAL_EULA} component={EULA} />
              <Route path={ROUTES.WEBINAR}>
                <WebinarSchedulePage authedAs={authedAs} />
              </Route>
              <Route
                path={`${ROUTES.WEBINAR_DETAIL}/:id`}
                component={WebinarDetailPage}
              />
              <Route path={ROUTES.SPRINT}>
                <SprintProgramPage authedAs={authedAs} />
              </Route>
              <Route
                path={`${ROUTES.SPRINT_DETAIL}/:id`}
                component={SprintProgramDetailPage}
              />
              <Route path={ROUTES.COUNSELING}>
                <MonthlyCounselingPage authedAs={authedAs} />
              </Route>
              <Route
                path={`${ROUTES.COUNSELING_DETAIL}/:id`}
                component={MonthlyCounselingDetailPage}
              />
              <Route
                path={ROUTES.FAQ}
                component={FAQ}
              />
              <QuestionnaireRoute
                path={ROUTES.QUESTIONNAIRE}
                component={Questionnaire}
                authenticated={authenticated}
                onFinish={this.updateProfile}
                allowAccess={[PROFILE_TYPE.RegularHSStudent]}
                {...routeProps}
              />
              <QuestionnaireRoute
                path={ROUTES.PARENT_QUESTIONNAIRE}
                component={ParentQuestionnaire}
                authenticated={authenticated}
                onFinish={this.updateProfile}
                allowAccess={[PROFILE_TYPE.Parent]}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.PARENT_PROFILE}
                allowAccess={[PROFILE_TYPE.Parent]}
                component={ParentProfile}
                handleUploadAvatar={this.handleUploadAvatar}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.PAYMENT}
                allowAccess={[PROFILE_TYPE.Parent]}
                {...routeProps}
              >
                <Payment authedAs={authedAs} />
              </PrivateRoute>
              <PrivateRoute
                path={ROUTES.PAYMENT_OK}
                allowAccess={[PROFILE_TYPE.Parent]}
                {...routeProps}
              >
                <Subscription />
              </PrivateRoute>
              <PrivateRoute
                path={ROUTES.EDUCATOR_PROFILE}
                allowAccess={[PROFILE_TYPE.Educator]}
                onFinish={this.updateProfile}
                handleUploadAvatar={this.handleUploadAvatar}
                component={EducatorsProfile}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.EDUCATOR_DETAILS}
                allowAccess={[
                  PROFILE_TYPE.Educator,
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={EducatorDetails}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.PUBLIC_PROFILE}
                allowAccess={[
                  PROFILE_TYPE.Educator,
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={PublicProfile}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.MY_CONTACT}
                allowAccess={[
                  PROFILE_TYPE.Educator,
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={MyContacts}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.CALENDAR}
                allowAccess={[
                  PROFILE_TYPE.Educator,
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={Calendar}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.MY_PROFILE}
                allowAccess={[PROFILE_TYPE.RegularHSStudent]}
                component={MyProfile}
                handleUploadAvatar={this.handleUploadAvatar}
                {...routeProps}
              ></PrivateRoute>
              <PrivateRoute
                path={ROUTES.GOAL}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={GoalSettingPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.TASKS}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={TasksManagerPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.COURSE}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={CoursePage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.COLLEGE}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={CollegePage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.ESSAY}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={EssayPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.ADMISSIONS}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={AdmissionsPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.ACTIVITIES}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={ActivitiesPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.TEST_PREP}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={TestPrepPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.MY_EVOLUTION}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={MyEvolution}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.HOME}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={HomePage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.FIN_AID}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={FinAidPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.MY_EDUCATOR}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={FindEducatorPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.RESOURCES}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={ResourcesPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.MY_HOMEWORK}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={MyHomeworkPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.CONVERSATIONS}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={MyConversationsPage}
                {...routeProps}
              />
              <PrivateRoute
                path={ROUTES.MY_PROGRESS}
                allowAccess={[
                  PROFILE_TYPE.RegularHSStudent,
                  PROFILE_TYPE.Parent,
                ]}
                component={MyProgressPage}
                {...routeProps}
              />
              <HomeRedirectRoute
                path={ROUTES.SIGN_IN}
                component={SignInStudent}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.SIGN_IN_EDUCATOR}
                component={SignInEducatorPage}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.SIGN_IN_PARENT}
                component={SignInParentPage}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.SIGN_UP}
                component={SignUpStudent}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.SIGN_UP_EDUCATOR}
                component={SignUpEducatorPage}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.SIGN_UP_PARENT}
                component={SignUpParentPage}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.LANDING_FORM}
                component={LeadFormPage}
                authenticated={authenticated}
              />
              <HomeRedirectRoute
                path={ROUTES.LANDING}
                component={LandingPage}
                authenticated={authenticated}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

function PrivateRoute({
  component: Component,
  allowAccess,
  authenticated,
  authedAs,
  handleUploadAvatar,
  onFinish,
  ...rest
}) {
  const HOComponent = (props) => {
    if (!authenticated) {
      return <Redirect to={{ pathname: ROUTES.LANDING }} />;
    }
    if (authedAs && authedAs.emailVerified === false) {
      return <VerifyEmail />;
    }
    if (!authedAs.hasProfile) {
      if (authedAs.userType === PROFILE_TYPE.Parent) {
        return <Redirect to={{ pathname: ROUTES.PARENT_QUESTIONNAIRE }} />;
      }
      if (authedAs.userType === PROFILE_TYPE.RegularHSStudent) {
        return <Redirect to={{ pathname: ROUTES.QUESTIONNAIRE }} />;
      }
    }
    if (authedAs.userType === PROFILE_TYPE.Educator) {
      return (
        <EducatorRoute
          {...props}
          {...rest}
          authedAs={authedAs}
          allowAccess={allowAccess}
          handleUploadAvatar={handleUploadAvatar}
          onFinish={onFinish}
          component={Component}
        />
      );
    }
    if (authedAs.userType === PROFILE_TYPE.Parent) {
      return (
        <ParentRoute
          {...props}
          {...rest}
          authedAs={authedAs}
          allowAccess={allowAccess}
          handleUploadAvatar={handleUploadAvatar}
          component={Component}
        />
      );
    }
    if (authedAs.userType === PROFILE_TYPE.RegularHSStudent) {
      return (
        <StudentRoute
          {...props}
          {...rest}
          authedAs={authedAs}
          allowAccess={allowAccess}
          handleUploadAvatar={handleUploadAvatar}
          component={Component}
        />
      );
    }
  };
  return <Route {...rest} render={HOComponent} />;
}

function QuestionnaireRoute({
  component: Component,
  authedAs,
  authenticated,
  onFinish,
  ...rest
}) {
  const HOComponent = (props) => {
    if (authenticated) {
      if (!authedAs.hasProfile) {
        return <Component {...props} onFinish={onFinish} authedAs={authedAs} />;
      } else {
        return <Redirect to={{ pathname: ROUTES.HOME }} />;
      }
    } else {
      return <Redirect to={{ pathname: ROUTES.LANDING }} />;
    }
  };
  return <Route {...rest} render={HOComponent} />;
}

function EducatorRoute({
  component: Component,
  authedAs,
  allowAccess,
  handleUploadAvatar,
  onFinish,
  ...rest
}) {
  const HOComponent = (props) => {
    if (allowAccess?.includes(authedAs.userType)) {
      if (authedAs.hasProfile) {
        return (
          <Component
            {...props}
            authedAs={authedAs}
            handleUploadAvatar={handleUploadAvatar}
            onFinish={onFinish}
          />
        );
      } else if (
        props.location &&
        props.location.pathname === ROUTES.EDUCATOR_PROFILE
      ) {
        return (
          <Component
            {...props}
            authedAs={authedAs}
            handleUploadAvatar={handleUploadAvatar}
            onFinish={onFinish}
          />
        );
      } else {
        return <Redirect to={{ pathname: ROUTES.EDUCATOR_PROFILE }} />;
      }
    } else {
      return <Redirect to={{ pathname: ROUTES.EDUCATOR_DETAILS_ABOUT }} />;
    }
  };
  return <Route {...rest} render={HOComponent} />;
}

function StudentRoute({
  component: Component,
  authedAs,
  allowAccess,
  handleUploadAvatar,
  ...rest
}) {
  const HOComponent = (props) => {
    if (authedAs.hasProfile) {
      if (!authedAs.userVerified) {
        if (props.location && props.location.pathname === ROUTES.MY_PROFILE) {
          return (
            <Component
              {...props}
              authedAs={authedAs}
              handleUploadAvatar={handleUploadAvatar}
            />
          );
        } else {
          return <Redirect to={{ pathname: ROUTES.MY_PROFILE }} />;
        }
      } else if (allowAccess?.includes(authedAs.userType)) {
        return (
          <Component
            {...props}
            authedAs={authedAs}
            handleUploadAvatar={handleUploadAvatar}
          />
        );
      } else {
        return <Redirect to={{ pathname: ROUTES.HOME }} />;
      }
    } else {
      return <Redirect to={{ pathname: ROUTES.QUESTIONNAIRE }} />;
    }
  };
  return <Route {...rest} render={HOComponent} />;
}

function ParentRoute({
  component: Component,
  authedAs,
  allowAccess,
  handleUploadAvatar,
  ...rest
}) {
  const HOComponent = (props) => {
    if (!authedAs.userVerified) {
      if (props.location && props.location.pathname === ROUTES.PARENT_PROFILE) {
        return (
          <ParentProfile
            {...props}
            authedAs={authedAs}
            handleUploadAvatar={handleUploadAvatar}
          />
        );
      } else {
        return <Redirect to={{ pathname: ROUTES.PARENT_PROFILE }} />;
      }
    } else if (allowAccess?.includes(authedAs.userType)) {
      return (
        <Component
          {...props}
          authedAs={authedAs}
          handleUploadAvatar={handleUploadAvatar}
        />
      );
    } else {
      return <Redirect to={{ pathname: ROUTES.PARENT_PROFILE }} />;
    }
  };
  return <Route {...rest} render={HOComponent} />;
}

export default withFirebase(App);
