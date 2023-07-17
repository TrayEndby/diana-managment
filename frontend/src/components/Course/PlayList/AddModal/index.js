import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import ErrorDialog from '../../../../util/ErrorDialog';
import playListService from '../../../../service/PlayListService';
import courseService from '../../../../service/CourseService';

class AddPlayListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playList: null, // [{id: number, name: string, courses: [{id: number, title: string}]}],
      data: {},
      validated: false,
      error: null
    };
  }

  componentDidMount() {
    this.fetchPlayList();
  }

  fetchPlayList = async () => {
    try {
      let playList = await playListService.listVideos();
      this.setState({
        playList
      });
    } catch (e) {
      this.handleError(e);
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

  handleSubmit = async(event, createNew) => {
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
        if (createNew) {
          await this.createNewPlayList();
          this.fetchPlayList();
        } else {
          await this.addCourseToList();
        }
        this.props.onSubmit();
      } catch (e) {
        if (e && e.message.includes('Duplicate entry')) {
          this.handleError(new Error('Video has already added to playlist'));
        } else {
          this.handleError(e);
        }
      }
    }
  }

  createNewPlayList = async () => {
    let { newName } = this.state.data;
    let item = this.getItemFromCourse();
    return playListService.addVideoList(newName, item);
  }

  addCourseToList = async () => {
    let { selectedList } = this.state.data;
    if (!selectedList) {
      throw new Error("Invalid playlist");
    }
    let id = Number(selectedList);
    let item = this.getItemFromCourse();
    return playListService.addItem(id, item);
  }

  getItemFromCourse = () => {
    let { course } = this.props;
    return [{
      title: course.title,
      url: courseService.getWatchURL(course),
      video: {
        vid: course.vid
      }
    }];
  }

  handleClose = () => {
    this.setState({
      validated: false,
      error: null
    });
    this.props.onClose();
  }

  render() {
    let { playList, validated, error } = this.state;
    let { show } = this.props;
    return (
      <Modal
        show={show}
        onHide={this.handleClose}
        size="lg"
        aria-labelledby="add-playlist-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-playlist-modal">
            Save to...
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorDialog error={error}></ErrorDialog>
          {
            playList &&
            <PlayListForm
              playList={playList}
              validated={validated}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
            />
          }
          {
            !error && !playList &&
            <div>Loading...</div>
          }
        </Modal.Body>
      </Modal>
    );
  }
}

const PlayListForm = ({
  playList, validated,
  onChange, onSubmit
}) => {
  const [createNew, toggleCreateNew] = useState(false);
  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={(e) => onSubmit(e, createNew)}
    >
      {!createNew &&
      <Form.Group controlId="playListFormOption">
        <Form.Label>Select from the list</Form.Label>
        <Form.Control
          required
          as="select"
          name="selectedList"
          onChange={onChange}
        >
          <option value="">Choose...</option>
          {playList.map(({ name, id }) => (
            <option key={name} value={id}>{name}</option>
          ))}
        </Form.Control> 
      </Form.Group>
      }
      {
      <Form.Group>
        <div
          className="App-clickable text-primary"
          onClick={() => toggleCreateNew(!createNew)}
        >
          {createNew ? "Select from my playlist" : "+ Create new playlist"}
        </div>
      </Form.Group>
      }
      {createNew &&
      <Form.Group controlId="playListFormName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          required
          name="newName"
          onChange={onChange}
        />
        <Form.Control.Feedback type="invalid">
          Please fill in the name.
        </Form.Control.Feedback>
      </Form.Group>
      }
      <Button
        type="submit"
        className="float-right"
      >
        {createNew ? "Create" : "Save"}
      </Button>
    </Form>
  )
};

AddPlayListModal.propTypes = {
  show: PropTypes.bool,
  course: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

export default AddPlayListModal;