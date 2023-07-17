import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import AddACTModal from './AddACTModal';
import ACTItem from './ACTItem';
import { FormCard } from '../../Layout';

const propTypes = {
  tests: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const MATH_ID = 148;
const ENGLISTH_ID = 147;
const WRITING_ID = 151;
const READING_ID = 149;
const SCIENCE_ID = 150;

// XXX TODO: abstract common part with SAT card
class ACTCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      selectedDate: null,
    };
    this.sections = [
      {
        key: 'mathScore',
        name: 'Math',
        id: MATH_ID,
      },
      {
        key: 'englishScore',
        name: 'English',
        id: ENGLISTH_ID,
      },
      {
        key: 'readingScore',
        name: 'Reading',
        id: READING_ID,
      },
      {
        key: 'writingScore',
        name: 'Writing',
        id: WRITING_ID,
      },
      {
        key: 'scienceScore',
        name: 'Science',
        id: SCIENCE_ID,
      },
    ];
  }

  toggleAddModal = (showAddModal, selectedDate) => {
    this.setState({
      showAddModal,
      selectedDate,
    });
  };

  handleAddOrUpdate = (tests, yymm) => {
    const { selectedDate } = this.state;
    const testDates = this.getTests()[1];
    if (selectedDate !== yymm && testDates.includes(yymm)) {
      throw new Error('Test with the same date already exist.');
    } else {
      this.props.onChange(tests);
    }
  };

  getTests = () => {
    const { tests } = this.props;
    let dateToTestsMap = new Map(); // key: testDate, value: arrar of tests
    let testDates = [];

    if (tests.length) {
      let sectionIdSet = new Set();
      this.sections.forEach(({ id }) => sectionIdSet.add(id));

      const map = new Map(); // key: date, value: Map<test_id, test>
      tests.forEach((test) => {
        const { test_id, takenDate } = test;
        const yymm = moment(takenDate).format('YYYY-MM');
        if (sectionIdSet.has(test_id)) {
          let testMap = map.get(yymm);
          if (!testMap) {
            testMap = new Map();
            testDates.push(yymm);
          }
          testMap.set(test_id, test);
          map.set(yymm, testMap);
        }
      });
      testDates.sort(); // sort date;
      testDates.forEach((date) => {
        const testMap = map.get(date);
        const tests = this.sections.map(({ id }) => testMap.get(id));
        dateToTestsMap.set(date, tests);
      });
    }
    return [dateToTestsMap, testDates];
  };

  render() {
    const [dateToTestsMap, testDates] = this.getTests();
    const { selectedDate, showAddModal } = this.state;
    const { onDelete } = this.props;
    return (
      <Card>
        <Card.Body>
          <Card.Title>ACT scores</Card.Title>
          <FormCard>
            <Button
              variant="primary"
              style={{ width: 'fit-content', alignSelf: 'center' }}
              onClick={() => this.toggleAddModal(true, null)}
            >
              Add ACT score
            </Button>
            <Row style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
              {testDates.map((date) => {
                const test = dateToTestsMap.get(date);
                return (
                  <ACTItem
                    key={date}
                    sections={this.sections}
                    test={test}
                    onClick={() => this.toggleAddModal(true, date)}
                    onDelete={() => onDelete(test)}
                  />
                )  
              })}
            </Row>
          </FormCard>
        </Card.Body>
        <AddACTModal
          show={showAddModal}
          sections={this.sections}
          takenDate={selectedDate}
          tests={selectedDate ? dateToTestsMap.get(selectedDate) : null}
          onHide={() => this.toggleAddModal(false, null)}
          onSave={this.handleAddOrUpdate}
        />
      </Card>
    );
  }
}

ACTCard.propTypes = propTypes;

export default ACTCard;
