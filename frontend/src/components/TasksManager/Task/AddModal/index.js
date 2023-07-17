import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DateInput from 'util/DateInput';
import ErrorDialog from 'util/ErrorDialog';
import taskService from 'service/TaskService';

const propTypes = {
  show: PropTypes.bool,
  resource: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

class AddTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      validated: false,
      error: null
    };
  }

  handleChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value
      }
    });
  }

  handleSubmit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({
        validated: true
      });
    } else {
      this.setState({
        validated: false
      });

      let { title, due_time, notes } = this.state.data;
      let { resource } = this.props;
      try {
        await taskService.add({
          title,
          due_time: due_time,
          notes: notes || "",
          resource
        });
        this.props.onSubmit();
      } catch (e) {
        console.error(e);
        this.setState({
          error: e.message
        });
      }
    }
  }

  handleClose = () => {
    this.setState({
      validated: false,
      error: null
    });
    this.props.onClose();
  }

  render() {
    let { show, resource } = this.props;
    return (
      <Modal
        show={show}
        onHide={this.handleClose}
        size="lg"
        aria-labelledby="add-task-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-task-modal">
            Add Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={this.state.error}></ErrorDialog>
          <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
            <Form.Group as={Row} controlId="taskFormName">
              <Form.Label column sm="2">
                Task name
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  required
                  name="title"
                  onChange={this.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please fill in the task name.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {resource &&
            <Form.Group as={Row}>
              <Form.Label column sm="2">
                Video link
              </Form.Label>
              <Col sm="10" className="App-textOverflow">{resource}</Col>
            </Form.Group>
            }
            <Form.Group as={Row} controlId="taskFormDue">
              <Form.Label column sm="2">
                Due Date
              </Form.Label>
              <Col sm="10">
                <DateInput required name="due_time" onChange={this.handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="taskFormNotes">
              <Form.Label column sm="2">
                Notes
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  placeholder="Optional"
                  name="notes"
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>
            <Button type="submit" className="float-right">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

AddTaskModal.propTypes = propTypes;

export default AddTaskModal;