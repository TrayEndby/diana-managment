import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../util/ErrorDialog';
import financialAidService from '../../../../service/FinancialAidService';

import { fetchApplyStatus } from '../../MyList';

const propTypes = {
  program: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

const ID = "add-collegelist-modal";

class AddProgramModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      applyStatus: null,
      data: {},
      validated: false,
      error: null
    };
  }

  componentDidMount = () => {
    this.getApplyStatus();
  }

  async getApplyStatus() {
    try {
      this.setState({ loading: true });
      const applyStatus = await fetchApplyStatus();
      this.setState({
        applyStatus
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
      error: error.message
    });
  }

  handleChange = (event) => {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value.trim()
      }
    });
  }

  handleSubmit = async (event) => {
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

      try {
        let ret = await this.addCollegeToList();
        this.props.onSubmit(ret);
      } catch (e) {
        this.handleError(e);
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

  addCollegeToList = async () => {
    const { program } = this.props;
    const { id } = program;
    const { applyStatus } = this.state.data;
    await financialAidService.AddUserFinAid([{ finaid_id: id, status: +applyStatus }]);
    return [program.id, +applyStatus];
  }

  render() {
    const { loading, applyStatus, validated, error } = this.state;
    const { program } = this.props;
    return (
      <Modal
        show={program != null}
        onHide={this.handleClose}
        size="lg"
        aria-labelledby={ID}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id={ID}>
            Add Financial Aid program to my list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading &&
            <div>Loading...</div>
          }
          {!loading && error &&
            <ErrorDialog error={error}></ErrorDialog>
          }
          {!loading && !error &&
            <ProgramListForm
              program={program}
              validated={validated}
              applyStatus={applyStatus}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          }
        </Modal.Body>
      </Modal>
    );
  }
}

const ProgramListForm = ({
  program, validated, applyStatus,
  onChange, onSubmit
}) => {
  if (!program) {
    return null;
  }
  const { name } = program;
  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={onSubmit}
    >
      <Form.Group>
        <Form.Label>Program: {name}</Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>Applying Status:</Form.Label>
        <Form.Control
          required
          as="select"
          name="applyStatus"
          onChange={onChange}
        >
          <option value="">Choose...</option>
          {applyStatus && applyStatus.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Button
        type="submit"
        className="float-right"
      >
        Save
      </Button>
    </Form>
  )
};

AddProgramModal.propTypes = propTypes;

export default AddProgramModal;