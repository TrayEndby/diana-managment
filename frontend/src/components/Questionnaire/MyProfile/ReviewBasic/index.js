import React from 'react';
import { withRouter } from 'react-router-dom';

import DemographicsCard from './DemographicsCard';
import HighSchoolCard from './HighSchoolCard';
import UnsavedInfoAlert from './UnsavedInfoAlert';
import SaveChange from './SaveChange';

import ErrorDialog from 'util/ErrorDialog';
import UserProfileSearchService from 'service/UserProfileSearchService';
import userProfilePicService from 'service/UserProfilePicService';
import * as ROUTES from 'constants/routes';

class ReviewBasic extends React.Component {
  constructor() {
    super();
    this.state = {
      basicInfo: {},
      schoolInfo: {},
      saved: {
        profilePic: true,
        basicInfoSaved: true,
        schoolInfoSaved: true,
      },
      error: null,
    };
  }

  componentDidMount = async () => {
    const data = await UserProfileSearchService.searchProfile();
    if (data && data.profile) {
      const basic = data.profile.basic;
      const schools = data.profile.schools;
      const latestSchool = schools ? schools[schools.length - 1] || {} : {};
      this.setState({
        basicInfo: {
          ...basic,
          birthday: basic.birthday ? basic.birthday.split('T')[0] : undefined,
        },
        schoolInfo: {
          country: 'United States', // default value
          ...latestSchool,
        },
      });
      // this.setState({ basicInfo: data.profile.basic });
      // const pic = await this.downloadPic()
    }
  };

  setBasicInfo = (field, value) => {
    let basicInfo = {
      ...this.state.basicInfo,
      [field]: value,
    };
    this.setState({ basicInfo });
  };

  saveBasicInfo = async () => {
    await UserProfileSearchService.insertBasicInfo(this.state.basicInfo);
  };

  setSchoolInfo = (data) => {
    const schoolInfo = {
      ...this.state.schoolInfo,
      ...data,
    };
    this.setState({ schoolInfo });
  };

  saveSchoolInfo = async () => {
    await UserProfileSearchService.insertSchoolInfo(this.state.schoolInfo);
  };

  markUnsaved = (field, value) => {
    const saved = this.state.saved;
    if (saved[field]) {
      saved[field] = value;
      this.setState({ saved: saved });
    }
  };

  saveChanges = async () => {
    try {
      this.setState({ error: null });
      //create variable here, single setState statement
      if (!this.state.saved.basicInfoSaved) {
        await this.saveBasicInfo();
        let saved = this.state.saved;
        saved['basicInfoSaved'] = true;
        this.setState({ saved: saved });
      }
      if (!this.state.saved.schoolInfoSaved) {
        await this.saveSchoolInfo();
        let saved = this.state.saved;
        saved['schoolInfoSaved'] = true;
        this.setState({ saved: saved });
      }
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
    }
  };

  saveChangesAndRedirect = async () => {
    await this.saveChanges();
    this.props.history.push(ROUTES.HOME);
  };

  downloadPic = async () => {
    // XXX @Irene, please check if it's doing the correct thing
    try {
      const image = await userProfilePicService.download();
      this.setState({ profilePic: image });
    } catch (e) {
      console.error(e);
    }
  };

  showAlert = () => {
    if (this.props.readonly) {
      return;
    }
    const { saved } = this.state;
    const flag = Object.values(saved).includes(false);

    if (flag) {
      return <UnsavedInfoAlert saveChanges={this.saveChanges} />;
    }
  };

  render() {
    const { readonly } = this.props;
    const { error, basicInfo, schoolInfo } = this.state;

    return (
      <>
        <ErrorDialog error={error} />
        {this.showAlert()}
        <DemographicsCard
          basicInfo={basicInfo}
          setBasicInfo={this.setBasicInfo}
          markUnsaved={this.markUnsaved}
        />
        <HighSchoolCard
          schoolInfo={schoolInfo}
          markUnsaved={this.markUnsaved}
          setSchoolInfo={this.setSchoolInfo}
        />
        {!readonly && (
          <SaveChange text="Finish" onClick={this.saveChangesAndRedirect} />
        )}
      </>
    );
  }
}

export default withRouter(ReviewBasic);
