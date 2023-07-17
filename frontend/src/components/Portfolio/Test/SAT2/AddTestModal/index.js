import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../../util/ErrorDialog';

const propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  test: PropTypes.object,
  minScore: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  stepScore: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

/**
 * TODO: implement "Add option", make sure it is conditional and does not appear as course name
 * Add delete option
 */

class AddTestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        test_id: undefined,
        subject: undefined,
        score: undefined,
        year: undefined,
        month: undefined,
      },
      validated: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { show, test } = this.props;
    if (!prevProps.show && show && test != null) {
      const { takenDate } = test;
      const [year, month] = takenDate.split('-');
      const data = {
        ...test,
        year,
        month,
      };
      this.setState({
        data,
      });
    }
  }

  handleSubjectChange = (event) => {
    const test_id = Number(event.target.value);
    const subjectArray = this.props.subjectList.filter(({ id }) => id === test_id);
    if (subjectArray.length) {
      const subject = subjectArray[0].name;
      this.setState({
        data: {
          ...this.state.data,
          test_id,
          subject,
        },
      });
    }
  };

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
        const { test } = this.props;
        const { test_id, score, year, month } = data;
        if (test && test.test_id !== test_id) {
          throw new Error("Cannot change existing test's subject");
        }
        const takenDate = `${year}-${month}-01`;
        this.props.onSave({
          id: `tempId-${new Date().getTime()}`,
          ...test,
          test_id,
          score,
          takenDate,
          subject: undefined
        });
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
    const { title, show, subjectList, minScore, maxScore, stepScore } = this.props;
    const { data, validated, error } = this.state;
    const { test_id, score, year, month } = data;
    return (
      <Modal show={show} onHide={this.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
            <Form.Group controlId="test-subject-name">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                required
                name="test_id"
                as="select"
                value={test_id || ''}
                onChange={this.handleSubjectChange}
              >
                <option value="">Select a subject</option>
                {subjectList.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="test-score">
              <Form.Label>Score</Form.Label>
              <Form.Control
                required
                name="score"
                type="number"
                min={minScore}
                max={maxScore}
                step={stepScore}
                placeholder="Enter score"
                value={score || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="test-year">
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
            <Form.Group controlId="test-month">
              <Form.Label>Month</Form.Label>
              <Form.Control required name="month" as="select" value={month || ''} onChange={this.handleChange}>
                <option value="">Select month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Form.Control>
            </Form.Group>
            <Button type="submit" className="float-right">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

AddTestModal.propTypes = propTypes;

export default AddTestModal;
