import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import AddSATModal from './AddSATModal';
import SATItem from './SATItem';

import { FormCard } from '../../Layout';

const propTypes = {
  tests: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const MATH_ID = 145;
const WRITING_ID = 144;
const READING_ID = 143;
const ESSAY_ID = 146;

// section for SAT score
// XXX TODO: handle skip case, which should revert data to default
class SATCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      selectedDate: null,
    };
    this.sections = [
      {
        key: 'mathScore',
        name: 'Math score',
        id: MATH_ID,
      },
      {
        key: 'readingScore',
        name: 'Reading score',
        id: READING_ID,
      },
      {
        key: 'writingScore',
        name: 'Writing score',
        id: WRITING_ID,
      },
      {
        key: 'essayScore',
        name: 'Essay score',
        id: ESSAY_ID,
      },
    ];
  }

  toggleAddModal = (showAddModal, selectedDate) => {
    this.setState({
      showAddModal,
      selectedDate,
    });
  };

  handleSaveSAT = (tests, yymm) => {
    const { selectedDate } = this.state;
    const testDates = this.getSATTests()[1];
    if (selectedDate !== yymm && testDates.includes(yymm)) {
      throw new Error('Test with the same year and month already exist.');
    } else {
      this.props.onChange(tests);
    }
  };

  getSATTests = () => {
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
    const [dateToTestsMap, testDates] = this.getSATTests();
    const { selectedDate, showAddModal } = this.state;
    const { onDelete } = this.props;
    return (
      <Card>
        <Card.Body>
          <Card.Title>SAT scores</Card.Title>
          <FormCard>
            <Button
              variant="primary"
              style={{ width: 'fit-content', alignSelf: 'center' }}
              onClick={() => this.toggleAddModal(true, null)}
            >
              Add SAT score
            </Button>
            <Row style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
              {testDates.map((date, index) => {
                const test = dateToTestsMap.get(date);
                return (
                  <SATItem
                    key={date}
                    sections={this.sections}
                    test={test}
                    onClick={() => this.toggleAddModal(true, date)}
                    onDelete={() => onDelete(test)}
                  />
                );
              })}
            </Row>
          </FormCard>
        </Card.Body>
        <AddSATModal
          show={showAddModal}
          sections={this.sections}
          takenDate={selectedDate}
          tests={selectedDate ? dateToTestsMap.get(selectedDate) : null}
          onHide={() => this.toggleAddModal(false, null)}
          onSave={this.handleSaveSAT}
        />
      </Card>
    );
  }
}

SATCard.propTypes = propTypes;

export default SATCard;
