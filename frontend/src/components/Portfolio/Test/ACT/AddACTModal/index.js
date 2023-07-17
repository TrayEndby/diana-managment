import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../../util/ErrorDialog';

const propTypes = {
  show: PropTypes.bool.isRequired,
  sections: PropTypes.array.isRequired,
  takenDate: PropTypes.string,
  tests: PropTypes.array,
  onSave: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

/**
 * TODO: implement "Add option", make sure it is conditional and does not appear as course name
 * Add delete option
 *
 * combine with AddSATModal
 */

class AddACTModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        mathScore: undefined,
        englishScore: undefined,
        readingScore: undefined,
        writingScore: undefined,
        scienceScore: undefined,
        year: undefined,
        month: undefined,
      },
      validated: false,
      error: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { show, tests, sections, takenDate } = this.props;
    if (!prevProps.show && show && tests != null) {
      const idToTestMap = new Map();
      tests.forEach((test) => idToTestMap.set(test.test_id, test));
      const [year, month] = takenDate.split('-');
      const data = {
        year,
        month,
      };
      sections.forEach(({ key, id }) => {
        const test = idToTestMap.get(id) || {};
        data[key] = test.score;
      });
      this.setState({
        data,
      });
    }
  }

  handleChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleSubmit = (event) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        this.setState({ validated: true });
      } else {
        const { data } = this.state;
        const { year, month } = data;
        const yymm = `${year}-${month}`;
        const takenDate = `${yymm}-01`;
        const { tests, sections, onSave } = this.props;
        const idToTestMap = new Map();
        if (tests) {
          tests.forEach((test) => idToTestMap.set(test.test_id, test));
        }
        const updatedTests = sections.map(({ key, id }, index) => {
          const currentTest = idToTestMap.get(id) || {};
          return {
            id: `tempId-${new Date().getTime()}-${index}`,
            ...currentTest,
            test_id: id,
            score: data[key],
            takenDate,
          };
        });
        onSave(updatedTests, yymm);
        this.handleClose();
      }
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  };

  handleClose = () => {
    this.setState({
      validated: false,
      data: {},
      error: null,
    });
    this.props.onHide();
  };

  getValidYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 4; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  render() {
    const { show } = this.props;
    const { data, validated, error } = this.state;
    const { mathScore, englishScore, readingScore, writingScore, scienceScore, year, month } = data;
    return (
      <Modal show={show} onHide={this.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add ACT score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Math score</Form.Label>
              <Form.Control
                required
                name="mathScore"
                type="number"
                min={1}
                max={36}
                step={1}
                placeholder="Enter math score"
                value={mathScore || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>English score</Form.Label>
              <Form.Control
                required
                name="englishScore"
                type="number"
                min={1}
                max={36}
                step={1}
                placeholder="Enter English score"
                value={englishScore || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reading score</Form.Label>
              <Form.Control
                required
                name="readingScore"
                type="number"
                min={1}
                max={36}
                step={1}
                placeholder="Enter reading score"
                value={readingScore || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Science score</Form.Label>
              <Form.Control
                required
                name="scienceScore"
                type="number"
                min={1}
                max={36}
                step={1}
                placeholder="Enter science score"
                value={scienceScore || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Writing score</Form.Label>
              <Form.Control
                required
                name="writingScore"
                type="number"
                min={2}
                max={12}
                step={1}
                placeholder="Enter writing score"
                value={writingScore || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <div className="d-flex flex-row">
              <Form.Group className="col pl-0">
                <Form.Label>Year</Form.Label>
                <Form.Control required name="year" as="select" value={year || ''} onChange={this.handleChange}>
                  <option value="">Select year</option>
                  {this.getValidYears().map((year) => (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="col pr-0">
                <Form.Label>Month</Form.Label>
                <Form.Control required name="month" as="select" value={month || ''} onChange={this.handleChange}>
                  <option value="">Select month</option>
                  <option value={'01'}>January</option>
                  <option value={'02'}>February</option>
                  <option value={'03'}>March</option>
                  <option value={'04'}>April</option>
                  <option value={'05'}>May</option>
                  <option value={'06'}>June</option>
                  <option value={'07'}>July</option>
                  <option value={'08'}>August</option>
                  <option value={'09'}>September</option>
                  <option value={'10'}>October</option>
                  <option value={'11'}>November</option>
                  <option value={'12'}>December</option>
                </Form.Control>
              </Form.Group>
            </div>
            <Button type="submit" className="float-right">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

AddACTModal.propTypes = propTypes;

export default AddACTModal;
