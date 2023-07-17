import React from 'react';

import Layout from '../Layout';
import ECACard from './Card';

import { getDateFromString, parseDateToString} from './util';
import userProfileSearchService from '../../../service/UserProfileSearchService';

class ECA extends React.Component {
  constructor() {
    super();
    this.state = {
      ECAInfo: [],
      saved: {
        ECAInfoSaved: true,
      },
    };
  }

  fetchData = async () => {
    const data = await userProfileSearchService.searchProfile();
    if (data && data.profile) {
      this.setState({
        ECAInfo: this.normalizeECAs(data.profile.extraCurricular),
      });
    }
  };

  normalizeECAs = (ECAS) => {
    ECAS = ECAS || [];
    const normalizedECAs = [];
    ECAS.forEach((ECA) => {
      const { beginDate, endDate } = ECA;
      normalizedECAs.push({
        ...ECA,
        beginDate: getDateFromString(parseDateToString(beginDate)),
        endDate: getDateFromString(parseDateToString(endDate))
      });
    });
    return normalizedECAs;
  }

  setECAInfo = (newECA) => {
    let isNewECA = true;
    let newECAId = newECA.id;
    let ECAs = this.state.ECAInfo.map((ECA) => {
      const { id, program_id } = ECA;
      if ((newECAId && id === newECAId) || (!newECAId && !id && program_id === newECA.program_id)) {
        // when update saved ECA or update a newly added ECA
        isNewECA = false;
        return newECA;
      } else {
        return ECA;
      }
    });

    if (isNewECA) {
      ECAs = [...ECAs, newECA];
    }
    this.setState({ ECAInfo: ECAs });
    this.markUnsaved('ECAInfoSaved', false);
  };

  saveECAInfo = async () => {
    await userProfileSearchService.insertECAInfo(this.state.ECAInfo);
  };

  deleteECA = async (id, index) => {
    if (id != null) {
      await userProfileSearchService.deleteECA(id);
      this.fetchData();
    } else {
      // new achivement
      const ECAInfo = this.state.ECAInfo.filter((_v, i) => i !== index);
      this.setState({ ECAInfo });
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
    if (!saved.ECAInfoSaved) {
      await this.saveECAInfo();
      this.markUnsaved('ECAInfoSaved', true);
      this.fetchData();
    }
  };

  render() {
    const { ECAInfo, saved } = this.state;
    return (
      <Layout saved={saved} onSave={this.saveChanges} onMount={this.fetchData}>
        <ECACard ECAs={ECAInfo} onChange={this.setECAInfo} onDelete={this.deleteECA} />
      </Layout>
    );
  }
}

export default ECA;
