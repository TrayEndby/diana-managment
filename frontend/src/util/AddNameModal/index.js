import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import ErrorDialog from '../ErrorDialog';

const propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ID = 'add-name-modal';

class AddNameModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: null,
    };
  }

  handleChange = (event) => {
    this.setState({
      name: event.target.value,
      error: null,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name } = this.state;
    try {
      await this.props.onSubmit(name);
      this.handleClose();
    } catch (e) {
      console.error(e);
      this.setState({ error: e.message });
    }
  };

  handleClose = () => {
    this.setState({
      name: '',
      error: null,
    });
    this.props.onClose();
  };

  render() {
    const { name, error } = this.state;
    const { show, title } = this.props;
    return (
      <Modal show={show} onHide={this.handleClose} size="lg" aria-labelledby={ID} centered>
        <Modal.Header closeButton>
          <Modal.Title id={ID}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error} />
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control required onChange={this.handleChange} value={name} />
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

AddNameModal.propTypes = propTypes;

export default AddNameModal;
