import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import moment from 'moment';

import StartQuestionnaire from './StartQuestionnaire';
import Q2 from './Q2';
import Q3 from './Q3';
import Q4 from './Q4';
import Q5 from './Q5';
import Q6 from './Q6';
import Q7 from './Q7';
import Q8 from './Q8';
import ProfilePicUpload from './ProfilePicUpload';

import userProfileSearchService from 'service/UserProfileSearchService';
import authService from 'service/AuthService';
import * as ROUTES from 'constants/routes';

import style from './style.module.scss';

class Questionnaire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicInfo: {},
      schoolInfo: {},
      hasRestoreProgress: false,
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    try {
      const profile = await userProfileSearchService.getProfileAsync();
      if (profile) {
        const { basic, schools } = profile;
        const [firstName, lastName] = authService.getFirstAndLastName();
        const latestSchool = schools ? schools[schools.length - 1] || {} : {};

        this.setState({
          basicInfo: {
            ...basic,
            birthday: basic.birthday ? basic.birthday.split('T')[0] : undefined,
            firstName: basic.firstName || firstName,
            lastName: basic.lastName || lastName,
          },
          schoolInfo: {
            country: 'United States', // default value
            ...latestSchool,
          },
          testInfo: this.normalizeTests(profile.tests),
          courseInfo: profile.courses || [],
          majorInfo: profile.majors || [],
          ECAInfo: profile.extraCurricular || [],
          supplementaryInfo: profile.supplementary || {},
        });
      } else {
        this.setState({
          schoolInfo: {
            country: 'United States', // default value
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  normalizeTests = (tests) => {
    tests = tests || [];
    const normalizedTests = [];
    tests.forEach((test) => {
      let { takenDate } = test;
      let date = moment(takenDate, 'YYYY-MM-DD');
      if (date.isValid()) {
        takenDate = moment(takenDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        normalizedTests.push({
          ...test,
          takenDate,
        });
      } else if (!takenDate) {
        // some test may not have date
        normalizedTests.push(test);
      }
    });
    return normalizedTests;
  };

  deleteProfile = async () => {
    try {
      await userProfileSearchService.deleteProfile();
    } catch (e) {
      console.error(e);
    }
  };

  getBasicInfo = (field) => {
    return this.state.basicInfo[field];
  };

  setBasicInfo = (field, value) => {
    const basicInfo = {
      ...this.state.basicInfo,
      [field]: value,
    };
    this.setState({ basicInfo });
  };

  getSchoolInfo = (field) => {
    return this.state.schoolInfo[field];
  };

  setSchoolInfo = (data) => {
    const schoolInfo = {
      ...this.state.schoolInfo,
      ...data,
    };
    this.setState({ schoolInfo });
  };

  saveBasicInfo = async () => {
    await userProfileSearchService.insertBasicInfo(this.state.basicInfo);
  };

  saveSchoolInfo = async () => {
    await userProfileSearchService.insertSchoolInfo(this.state.schoolInfo);
    await this.fetchProfile();
  };

  render() {
    const { onFinish } = this.props;
    const { schoolInfo } = this.state;
    return (
      <div className={style.wrapper}>
        <div className={style.container}>
          <Switch>
            <Route
              exact
              path={ROUTES.QUESTIONNAIRE}
              component={StartQuestionnaire}
            />
            <Route
              path={ROUTES.QUESTIONNAIRE_Q1}
              component={ProfilePicUpload}
            />
            <Route path={ROUTES.QUESTIONNAIRE_Q2}>
              <Q2
                firstName={this.getBasicInfo('firstName')}
                lastName={this.getBasicInfo('lastName')}
                email={this.getBasicInfo('email')}
                birthday={this.getBasicInfo('birthday')}
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo}
              />
            </Route>
            <Route path={ROUTES.QUESTIONNAIRE_Q3}>
              <Q3
                gender={this.getBasicInfo('gender')}
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo}
              />
              ;
            </Route>
            <Route path={ROUTES.QUESTIONNAIRE_Q4}>
              <Q4
                hispanic={this.getBasicInfo('hispanic')}
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo}
              />
            </Route>
            <Route path={ROUTES.QUESTIONNAIRE_Q5}>
              <Q5
                race={this.getBasicInfo('race')}
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo}
              />
            </Route>
            <Route path={ROUTES.QUESTIONNAIRE_Q6}>
              <Q6
                first_generation_college={this.getBasicInfo(
                  'first_generation_college',
                )}
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo}
              />
            </Route>
            <Route path={ROUTES.QUESTIONNAIRE_Q7}>
              <Q7
                schoolInfo={schoolInfo}
                onChange={this.setSchoolInfo}
                onSave={this.saveSchoolInfo}
              />
            </Route>
            <Route path={ROUTES.QUESTIONNAIRE_Q8}>
              <Q8
                year={schoolInfo.class}
                onChange={this.setSchoolInfo}
                onSave={this.saveSchoolInfo}
                onFinish={onFinish}
              />
            </Route>
            <Redirect to={ROUTES.QUESTIONNAIRE} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Questionnaire;
