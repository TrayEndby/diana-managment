import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ConfirmDialog from '../../../../util/ConfirmDialog';
import ErrorDialog from '../../../../util/ErrorDialog';
import notesService from '../../../../service/NotesService';

class DeleteNoteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleSubmit = async () => {
    this.setState({
      error: null
    });

    try {
      await notesService.delete(this.props.noteId);
      this.props.onSubmit(this.props.noteId);
    } catch (e) {
      console.error(e);
      this.setState({
        error: e.message
      });
    }
  }

  handleClose = () => {
    this.setState({
      error: null
    });
    this.props.onClose();
  }

  render() {
    let show = this.props.noteId != null;
    return (
      <ConfirmDialog
        show={show}
        title="Delete Note"
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
      >
        <ErrorDialog error={this.state.error}></ErrorDialog>
        Are you sure you want to delete the note?
      </ConfirmDialog>
    );
  }
}

DeleteNoteModal.propTypes = {
  noteId: PropTypes.number,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

export default DeleteNoteModal;