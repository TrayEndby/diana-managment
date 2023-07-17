import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../../util/ErrorDialog';

const propTypes = {
  show: PropTypes.bool.isRequired,
  test: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

/**
 * TODO: implement "Add option", make sure it is conditional and does not appear as course name
 * Add delete option
 */

class AddIBModal extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        test_id: undefined,
        subject: undefined,
        score: undefined,
        year: undefined,
        level: undefined,
      },
      validated: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { show, test } = this.props;
    if (!prevProps.show && show && test != null) {
      const { takenDate } = test;
      const [year] = takenDate.split('-');
      const data = {
        ...test,
        year,
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
        const { test_id, score, year, level } = data;
        if (test && test.test_id !== test_id) {
          throw new Error("Cannot change existing test's subject");
        }
        const takenDate = `${year}-01-01`;
        this.props.onSave({
          id: `tempId-${new Date().getTime()}`,
          ...test,
          test_id,
          score,
          takenDate,
          level: Number(level),
          subject: undefined,
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
    const { show, subjectList } = this.props;
    const { data, validated, error } = this.state;
    const { test_id, score, year, level } = data;

    return (
      <Modal show={show} onHide={this.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add IB course score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
            <Form.Group controlId="IB-subject-name">
              <Form.Label>Subject name</Form.Label>
              <Form.Control required as="select" value={test_id || ''} onChange={this.handleSubjectChange}>
                <option value="">Select a subject</option>
                {subjectList.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="IB-level">
              <Form.Label>Level</Form.Label>
              <Form.Control required name="level" as="select" value={level || ''} onChange={this.handleChange}>
                <option value="">Select a level</option>
                <option value={1}>Higher level</option>
                <option value={2}>Standard level</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="IB-score" onChange={this.handleScoreChange}>
              <Form.Label>Score</Form.Label>
              <Form.Control
                required
                name="score"
                type="number"
                min={0}
                max={7}
                step={1}
                placeholder="Enter score"
                value={score || ''}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="IB-year" onChange={this.handleYearChange}>
              <Form.Label>Year completed</Form.Label>
              <Form.Control required name="year" as="select" value={year || ''} onChange={this.handleChange}>
                <option value="">Select year</option>
                {this.getValidYears().map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
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

AddIBModal.propTypes = propTypes;

export default AddIBModal;
