import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../util/ErrorDialog';
import playListService from '../../../../service/PlayListService';

const propTypes = {
  essay: PropTypes.object,
  myEssaysList: PropTypes.array.isRequired, // [{id: number, name: string}]
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// XXX TODO generalize with Course/PlayList/AddModal
class SaveEssayModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      validated: false,
      error: null,
    };
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
        [event.target.name]: event.target.value.trim(),
      },
    });
  };

  handleSubmit = async (event, createNew) => {
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
        if (createNew) {
          await this.createNewEssayList();
        } else {
          await this.addEssayToList();
        }
        this.props.onSubmit();
      } catch (e) {
        this.handleError(e);
      }
    }
  };

  createNewEssayList = async () => {
    let { newName } = this.state.data;
    let item = this.getItemFromEssay();
    return playListService.addEssayList(newName, item);
  };

  addEssayToList = async () => {
    let { selectedList } = this.state.data;
    if (!selectedList) {
      throw new Error('Invalid playlist');
    }
    let id = Number(selectedList);
    let item = this.getItemFromEssay();
    const { item: essayInTheList } = await playListService.getEssayListById(id);
    const isAlreadyAdded = essayInTheList && essayInTheList.some(({ essay: { id } }) => id === item[0].essay.id);
    if (isAlreadyAdded) {
      throw new Error('Essay already added to the list');
    }
    return playListService.addItem(id, item);
  };

  getItemFromEssay = () => {
    const { essay } = this.props;
    const { title, id } = essay;
    return [
      {
        title,
        essay: {
          id,
        },
      },
    ];
  };

  handleClose = () => {
    this.setState({
      validated: false,
      error: null,
    });
    this.props.onClose();
  };

  render() {
    let { validated, error } = this.state;
    let { essay, myEssaysList } = this.props;
    return (
      <Modal show={essay != null} onHide={this.handleClose} size="lg" aria-labelledby="add-playlist-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="add-playlist-modal">Save to...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <ErrorDialog error={error} />}
          {myEssaysList && (
            <PlayListForm
              playList={myEssaysList}
              validated={validated}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          )}
          {!error && !myEssaysList && <div>Loading...</div>}
        </Modal.Body>
      </Modal>
    );
  }
}

const PlayListForm = ({ playList, validated, onChange, onSubmit }) => {
  const [createNew, toggleCreateNew] = useState(false);
  return (
    <Form noValidate validated={validated} onSubmit={(e) => onSubmit(e, createNew)}>
      {!createNew && (
        <Form.Group controlId="playListFormOption">
          <Form.Label>Select from the list</Form.Label>
          <Form.Control required as="select" name="selectedList" onChange={onChange}>
            <option value="">Choose...</option>
            {playList.map(({ name, id }) => (
              <option key={name} value={id}>
                {name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
      {
        <Form.Group>
          <div className="App-clickable text-primary" onClick={() => toggleCreateNew(!createNew)}>
            {createNew ? 'Select from favorite essays' : '+ Create new essay list'}
          </div>
        </Form.Group>
      }
      {createNew && (
        <Form.Group controlId="playListFormName">
          <Form.Label>Name</Form.Label>
          <Form.Control required name="newName" onChange={onChange} />
          <Form.Control.Feedback type="invalid">Please fill in the name.</Form.Control.Feedback>
        </Form.Group>
      )}
      <Button type="submit" className="float-right">
        {createNew ? 'Create' : 'Save'}
      </Button>
    </Form>
  );
};

SaveEssayModal.propTypes = propTypes;

export default SaveEssayModal;
