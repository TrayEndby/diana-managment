import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Q1 from './Q1';
import Q2 from './Q2';
import Q4 from './Q4';
import Q5 from './Q5';
import Q6 from './Q6';
import Q7 from './Q7';
import Q8 from './Q8';
import Q9 from './Q9';
import Q10 from './Q10';
import Q11 from './Q11';

import ProfilePicUpload from './ProfilePicUpload';
import userProfileSearchService from '../../service/UserProfileSearchService';
import style from './style.module.scss';
import * as ROUTES from '../../constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';

class ParentQuestionnaire extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicInfo: {},
      incomeLevel: 1,
      type: [PROFILE_TYPE.Parent]
    };
  }

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    try {
      const profile = await userProfileSearchService.getProfileAsync();
      if (profile) {
        const { basic } = profile;
        this.setState({
          basicInfo: {
            ...basic,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
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

  saveBasicInfo = async () => {
    const { basicInfo } = this.state;
    const type = basicInfo.type || [];
    if (!type.includes(PROFILE_TYPE.Parent)) {
      type.push(PROFILE_TYPE.Parent);
    }
    await userProfileSearchService.update(53, {
      ...basicInfo,
      type
    });
  };

  setIncomeLevel = (incomeLevel) => {
    this.setState({ ...this.state, incomeLevel });
  };

  saveIncomeLevel = async () => {
    const info = { ...this.state.basicInfo, income_level: this.state.incomeLevel };
    await userProfileSearchService.update(53, info);
  };

  render() {
    const { onFinish } = this.props;

    return (
      <div className={style.wrapper}>
        <div className={style.container}>
          <Switch>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q1}>
              <Q1
                firstName={this.getBasicInfo('firstName')}
                lastName={this.getBasicInfo('lastName')}
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo} />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q2}>
              <Q2 phone={this.getBasicInfo('phone')} onChange={this.setBasicInfo} onSave={this.saveBasicInfo} />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q3} component={ProfilePicUpload} />
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q4}>
              <Q4 gender={this.getBasicInfo('gender')} onChange={this.setBasicInfo} onSave={this.saveBasicInfo} />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q5}>
              <Q5 hispanic={this.getBasicInfo('hispanic')} onChange={this.setBasicInfo} onSave={this.saveBasicInfo} />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q6}>
              <Q6 race={this.getBasicInfo('race')} onChange={this.setBasicInfo} onSave={this.saveBasicInfo} />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q7}>
              <Q7
                mailingAdd={this.getBasicInfo('mailingAdd')}
                mailingCity={this.getBasicInfo('mailingCity')}
                mailingState={this.getBasicInfo('mailingState')}
                mailingZip={this.getBasicInfo('mailingZip')}
                mailingCountry={this.getBasicInfo('mailingCountry')}
                onChange={this.setBasicInfo} onSave={this.saveBasicInfo} />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q8}>
              <Q8
                incomeLevel={this.state.incomeLevel}
                onChange={this.setIncomeLevel}
                onSave={this.saveIncomeLevel}
              />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q9}>
              <Q9 />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q10}>
              <Q10 />
            </Route>
            <Route path={ROUTES.PARENT_QUESTIONNAIRE_Q11}>
              <Q11
                onChange={this.setBasicInfo}
                onSave={this.saveBasicInfo}
                onFinish={onFinish}
              />
            </Route>
            <Redirect to={ROUTES.PARENT_QUESTIONNAIRE_Q1} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(ParentQuestionnaire);
