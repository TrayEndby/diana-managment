import React from 'react';

import Layout from '../Layout';

import GRITCard from './GRIT';
import IQCard from './IQ';

import userProfileSearchService from '../../../service/UserProfileSearchService';

class Supplementary extends React.Component {
  constructor() {
    super();
    this.state = {
      supplementaryInfo: {},
      saved: {
        supplementaryInfoSaved: true,
      },
    };
  }

  fetchData = async () => {
    const data = await userProfileSearchService.searchProfile();
    if (data && data.profile) {
      const supplementaryData = data.profile.supplementary || {};
      this.setState({
        supplementaryInfo: supplementaryData,
      });
    }
  };

  markUnsaved = (field, value) => {
    this.setState({
      saved: {
        ...this.state.saved,
        [field]: value,
      },
    });
  };

  saveChanges = async () => {
    const { saved } = this.state;
    //create variable here, single setState statement
    if (!saved.supplementaryInfoSaved) {
      await this.saveSupplementaryInfo();
      this.markUnsaved('supplementaryInfoSaved', true);
    }
    this.fetchData();
  };

  setSupplementaryInfo = (field, value) => {
    this.setState({
      supplementaryInfo: {
        ...this.state.supplementaryInfo,
        [field]: value,
      },
    });
    this.markUnsaved('supplementaryInfoSaved', false);
  };

  saveSupplementaryInfo = async () => {
    await userProfileSearchService.insertSupplementaryInfo(this.state.supplementaryInfo);
  };

  render() {
    const { supplementaryInfo, saved } = this.state;
    const { GRIT, IQ } = supplementaryInfo;

    return (
      <Layout saved={saved} onSave={this.saveChanges} onMount={this.fetchData}>
        <GRITCard onChange={this.setSupplementaryInfo} GRIT={GRIT} />
        <IQCard onChange={this.setSupplementaryInfo} IQ={IQ} />
      </Layout>
    );
  }
}

export default Supplementary;
