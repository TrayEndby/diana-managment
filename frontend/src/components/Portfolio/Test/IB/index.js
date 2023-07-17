import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import AddIBModal from './AddIBModal';
import IBItem from './IBItem';
import { FormCard } from '../../Layout';

import userProfileListService from '../../../../service/UserProfileListService';

const propTypes = {
  tests: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const Test_TheoryOfKnowledge = 152;
const Test_ExtendedEssay = 153;

// XXX TODO: generalize with APCard
class IBCard extends Component {
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
    this.getData();
  }

  getData = async () => {
    try {
      const list = await userProfileListService.categoryList(18, 2);
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

  handleSelectTest = (test) => {
    this.toggleAddModal(true, test);
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

  getDefaultIBTests = () => {
    let theoryOfKnowledge = {};
    let extendedEssay = {};
    const { tests } = this.props;
    for (let test of tests) {
      const { test_id } = test;
      if (test_id === Test_TheoryOfKnowledge) {
        theoryOfKnowledge = test;
      } else if (test_id === Test_ExtendedEssay) {
        extendedEssay = test;
      }
    }
    return [theoryOfKnowledge, extendedEssay];
  };

  handleTheoryChange = (event) => {
    const [theoryOfKnowledge] = this.getDefaultIBTests();
    const test = {
      ...theoryOfKnowledge,
      test_id: Test_TheoryOfKnowledge,
      score: event.target.value,
    };
    this.props.onChange([test]);
  };

  handleEssayChange = (event) => {
    const extendedEssay = this.getDefaultIBTests()[1];
    const test = {
      ...extendedEssay,
      test_id: Test_ExtendedEssay,
      score: event.target.value,
    };
    this.props.onChange([test]);
  };

  render() {
    const [theoryOfKnowledge, extendedEssay] = this.getDefaultIBTests();
    const tests = this.getTests();
    const { error, loading, selectedTest, showAddModal, subjectList } = this.state;
    const { onDelete } = this.props;

    return (
      <Card>
        <Card.Body>
          <Card.Title>IB Diploma Programme scores</Card.Title>
          <FormCard loading={loading} error={error}>
            <Form>
              <Form.Group controlId="theory-of-knowledge-score">
                <Form.Label>Theory of Knowledge grade</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={3}
                  step={1}
                  placeholder="Enter grade"
                  value={theoryOfKnowledge.score || ''}
                  onChange={this.handleTheoryChange}
                />
              </Form.Group>
              <Form.Group controlId="extended-essay-grade">
                <Form.Label>Extended essay grade</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={3}
                  step={1}
                  placeholder="Enter grade"
                  value={extendedEssay.score || ''}
                  onChange={this.handleEssayChange}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={this.handleNewTest}
                style={{ width: 'fit-content', alignSelf: 'center' }}
              >
                Add subject
              </Button>
              <Row style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                {tests.map((test) => (
                  <IBItem
                    key={test.id + test.test_id}
                    test={test}
                    onClick={this.handleSelectTest}
                    onDelete={() => onDelete([test])}
                  />
                ))}
              </Row>
            </Form>
          </FormCard>
        </Card.Body>
        <AddIBModal
          show={showAddModal}
          subjectList={subjectList}
          test={selectedTest}
          onHide={this.handleHideAddModal}
          onSave={this.handleAddOrUpdate}
        />
      </Card>
    );
  }
}

IBCard.propTypes = propTypes;

export default IBCard;
