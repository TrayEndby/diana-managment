import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../util/ErrorDialog';
import collegeService from '../../../../service/CollegeService';

/**
 * Attribute of college:
 * name: string
 * state: string
 * evaluation: Enum
 */
const propTypes = {
  college: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};

const ID = 'add-collegelist-modal';

class AddCollegeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      applyStatus: null,
      data: {},
      validated: false,
      error: null,
    };
  }

  componentDidMount = () => {
    this.getApplyStatus();
  };

  async getApplyStatus() {
    try {
      this.setState({ loading: true });
      let applyStatus = await collegeService.listCollegeApplyStatus(true);
      this.setState({
        applyStatus,
      });
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  handleError = (error) => {
    console.error(error);
    this.setState({
      error: error.message,
    });
  };

  handleChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      this.setState({
        validated: true,
      });
    } else {
      this.setState({
        validated: false,
      });

      try {
        let ret = await this.addCollegeToList();
        this.props.onSubmit(ret);
      } catch (e) {
        this.handleError(e);
      }
    }
  };

  handleClose = () => {
    this.setState({
      validated: false,
      error: null,
    });
    this.props.onClose();
  };

  addCollegeToList = async () => {
    const { college } = this.props;
    const { id } = college;
    const { applyStatus, evaluation } = this.state.data;
    const internal = JSON.stringify({
      ...college,
      evaluation: evaluation || college.evaluation,
    });
    await collegeService.insertToMyList({ college_id: id, status: applyStatus, internal });
    return [college.id, applyStatus];
  };

  render() {
    const { loading, applyStatus, validated, error } = this.state;
    const { college } = this.props;
    return (
      <Modal show={college != null} onHide={this.handleClose} size="lg" aria-labelledby={ID} centered>
        <Modal.Header closeButton>
          <Modal.Title id={ID}>Add college to my list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <div>Loading...</div>}
          {!loading && error && <ErrorDialog error={error}></ErrorDialog>}
          {!loading && !error && (
            <CollegeListForm
              college={college}
              validated={validated}
              applyStatus={applyStatus}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

const CollegeListForm = ({ college, validated, applyStatus, onChange, onSubmit }) => {
  if (!college) {
    return null;
  }
  const { name } = college;
  return (
    <Form noValidate validated={validated} onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>College: {name}</Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>Applying Status:</Form.Label>
        <Form.Control required as="select" name="applyStatus" onChange={onChange}>
          <option value="">Choose...</option>
          {applyStatus.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Admission difficulty:</Form.Label>
        <Form.Control required as="select" name="evaluation" onChange={onChange}>
          <option value="">Choose...</option>
          {collegeService.listEvaluationTypes().map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button type="submit" className="float-right">
        Save
      </Button>
    </Form>
  );
};

AddCollegeModal.propTypes = propTypes;

export default AddCollegeModal;
