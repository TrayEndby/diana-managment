import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import ErrorDialog from '../../../../util/ErrorDialog';
import userProfileService from '../../../../service/UserProfileSearchService';

const propTypes = {
  show: PropTypes.bool.isRequired,
  category: PropTypes.number,
  type: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

const ID = 'add-new-eca-modal';

class AddNewECAModal extends Component {
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
        [event.target.name]: event.target.value,
      }
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

      const { data } = this.state;
      const { name, description } = data;
      const { category, type, onSubmit, onAdd } = this.props;
      try {
        const id = await userProfileService.ecaProgramInsertUpdate(name, description, category, type);
        onAdd(id, name)
        onSubmit();
        this.handleClose();
      } catch (e) {
        console.error(e);
        this.setState({ error: e.message });
      }
    }
  };

  handleClose = () => {
    this.setState({
      data: {},
      error: null,
      validated: false
    });
    this.props.onClose();
  };

  render() {
    const { data, validated, error } = this.state;
    const { name, description } = data;
    const { show } = this.props;
    return (
      <Modal show={show} onHide={this.handleClose} size="md" aria-labelledby={ID} centered>
        <Modal.Header closeButton>
          <Modal.Title id={ID}>Add new program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error} />
          <Form validated={validated} onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Program name:</Form.Label>
              <Form.Control required name="name" onChange={this.handleChange} value={name} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Program description (Optional):</Form.Label>
              <Form.Control as="textarea" name="description" onChange={this.handleChange} value={description} />
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

AddNewECAModal.propTypes = propTypes;

export default AddNewECAModal;
