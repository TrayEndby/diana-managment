import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import AddTestModal from '../SAT2/AddTestModal';
import TestItem from '../SAT2/TestItem';
import { FormCard } from '../../Layout';

import userProfileListService from '../../../../service/UserProfileListService';

const propTypes = {
  tests: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// XXX TODO: generalize with SAT2
class APCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      selectedTest: null,
      subjectList: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchSubjects();
  }

  fetchSubjects = async () => {
    try {
      const list = await userProfileListService.categoryList(18, 3);
      this.setState({
        subjectList: list.nameIds,
        loading: false,
      });
    } catch (e) {
      console.error(e);
      this.setState({
        error: e.message,
        loading: false,
      });
    }
  };

  toggleAddModal = (showAddModal, selectedTest) => {
    this.setState({
      showAddModal,
      selectedTest,
    });
  };

  getYYMM = (dateStr) => {
    try {
      const [year, month] = dateStr.split('-');
      return `${year}-${month}`;
    } catch (e) {
      console.error(e);
      return dateStr;
    }
  };

  handleNewTest = () => {
    this.toggleAddModal(true, null);
  };

  handleAddOrUpdate = (test) => {
    const { tests } = this.props;
    const { selectedTest } = this.state;
    const currentTestId = selectedTest ? selectedTest.test_id : null;
    const { test_id, takenDate } = test;
    const yymm = this.getYYMM(takenDate);
    for (let existingTest of tests) {
      if (
        existingTest.test_id === test_id &&
        this.getYYMM(existingTest.takenDate) === yymm &&
        currentTestId !== test_id
      ) {
        throw new Error('Test with the same year and month already exist.');
      }
    }
    this.props.onChange([test]);
  };

  handleHideAddModal = () => {
    this.toggleAddModal(false, null);
  };

  getTests = () => {
    const { tests } = this.props;
    const { subjectList } = this.state;
    let sectionTests = [];

    if (tests.length) {
      let subjectIdMap = new Map();
      subjectList.forEach(({ id, name }) => subjectIdMap.set(id, name));

      tests.forEach((test) => {
        const { test_id } = test;
        if (subjectIdMap.has(test_id)) {
          sectionTests.push({
            ...test,
            subject: subjectIdMap.get(test_id),
          });
        }
      });
      // sort by date
      sectionTests.sort((tA, tB) => {
        let dA = new Date(tA.takenDate);
        let dB = new Date(tB.takenDate);
        return dA < dB ? -1 : dA === dB ? 0 : 1;
      });
    }
    return sectionTests;
  };

  render() {
    const tests = this.getTests();
    const { error, loading, selectedTest, showAddModal, subjectList } = this.state;
    const { onDelete } = this.props;

    return (
      <Card>
        <Card.Body>
          <Card.Title>AP exam scores</Card.Title>
          <FormCard loading={loading} error={error}>
            <Button
              variant="primary"
              onClick={this.handleNewTest}
              style={{ width: 'fit-content', alignSelf: 'center' }}
            >
              Add AP exam score
            </Button>
            <Row style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
              {tests.map((test) => (
                <TestItem
                  key={test.id + test.test_id}
                  test={test}
                  onClick={() => this.toggleAddModal(true, test)}
                  onDelete={() => onDelete([test])}
                />
              ))}
            </Row>
          </FormCard>
        </Card.Body>
        <AddTestModal
          title="Add AP exam score"
          show={showAddModal}
          subjectList={subjectList}
          test={selectedTest}
          minScore={1}
          maxScore={5}
          step={1}
          onHide={this.handleHideAddModal}
          onSave={this.handleAddOrUpdate}
        />
      </Card>
    );
  }
}

APCard.propTypes = propTypes;

export default APCard;
