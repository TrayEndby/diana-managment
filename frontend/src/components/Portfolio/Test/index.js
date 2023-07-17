import React from 'react';

import moment from 'moment';

import Layout from '../Layout';
import SATCard from './SAT';
import ACTCard from './ACT';
import SAT2Card from './SAT2';
import APCard from './AP';
import IBCard from './IB';

import userProfileSearchService from '../../../service/UserProfileSearchService';
import ErrorDialog from '../../../util/ErrorDialog';

class Tests extends React.Component {
  constructor() {
    super();
    this.state = {
      testInfo: [],
      saved: {
        testInfoSaved: true,
      },
      error: null,
    };
  }

  fetchData = async () => {
    const data = await userProfileSearchService.searchProfile();
    if (data && data.profile) {
      const testInfo = this.normalizeTests(data.profile.tests);
      this.setState({
        testInfo,
        error: null,
      });
    }
  };

  handleError = (e) => {
    console.error(e);
    this.setState({ error: e.message });
  };

  getTestKey = (test) => {
    const { id, test_id, takenDate } = test;
    if (id) {
      return id; // when have id, use id as key
    } else {
      return `${test_id}-${takenDate}`;
    }
  };

  isTempId = (id) => {
    return typeof id === 'string' && id.startsWith('temp');
  };

  setTestInfo = (testList) => {
    let idToTestMap = new Map();
    testList.forEach((test) => {
      idToTestMap.set(this.getTestKey(test), test);
    });
    // update existing test
    let set = new Set();
    let { testInfo } = this.state;
    testInfo = testInfo.map((test) => {
      const key = this.getTestKey(test);
      const updatedTest = idToTestMap.get(key);
      if (updatedTest) {
        set.add(updatedTest);
        return {
          ...test,
          ...updatedTest,
        };
      } else {
        return test;
      }
    });

    let newTests = [];
    idToTestMap.forEach((test) => {
      if (!set.has(test)) {
        newTests.push(test);
      }
    });
    testInfo = [...testInfo, ...newTests];
    this.setState({ testInfo });
    this.markUnsaved('testInfoSaved', false);
  };

  saveTestInfo = async () => {
    const testInfo = this.state.testInfo.map((test) => {
      const { id } = test;
      if (this.isTempId(id)) {
        // remove the fake test in the front end
        return {
          ...test,
          id: undefined,
        };
      } else {
        return test;
      }
    });
    await userProfileSearchService.insertTestInfo(testInfo);
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

  markUnsaved = (field, value) => {
    this.setState({
      saved: {
        ...this.state.saved,
        [field]: value,
        error: null,
      },
    });
  };

  saveChanges = async () => {
    const { saved } = this.state;
    if (!saved.testInfoSaved) {
      await this.saveTestInfo();
      this.markUnsaved('testInfoSaved', true);
      this.fetchData();
    }
  };

  deleteTest = async (tests) => {
    try {
      const tempTests = new Set();
      tests = tests.filter((test) => {
        const { id } = test;
        if (this.isTempId(id)) {
          tempTests.add(id);
          return false;
        }
        return true;
      });

      if (tempTests.size) {
        // when has temp tests
        const testInfo = this.state.testInfo.filter(({ id }) => !tempTests.has(id));
        this.setState({ testInfo });
      }

      if (tests.length) {
        // when has test to delete
        await userProfileSearchService.deleteTest(tests);
        this.fetchData();
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  render() {
    const { testInfo, saved, error } = this.state;

    return (
      <Layout saved={saved} onSave={this.saveChanges} onMount={this.fetchData}>
        <ErrorDialog error={error} />
        <SATCard tests={testInfo} onChange={this.setTestInfo} onDelete={this.deleteTest} />
        <ACTCard tests={testInfo} onChange={this.setTestInfo} onDelete={this.deleteTest} />
        <SAT2Card tests={testInfo} onChange={this.setTestInfo} onDelete={this.deleteTest} />
        <APCard tests={testInfo} onChange={this.setTestInfo} onDelete={this.deleteTest} />
        <IBCard tests={testInfo} onChange={this.setTestInfo} onDelete={this.deleteTest} />
      </Layout>
    );
  }
}

export default Tests;
