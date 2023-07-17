import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { PlusSquareFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';

import DeleteNoteModal from '../DeleteModal';
import NoteDetail from '../Detail';
import NoteList from '../List';

import { parseSearchParams } from '../../../../util/helpers';
import Tooltip from '../../../../util/Tooltip';
import ErrorDialog from '../../../../util/ErrorDialog';
import notesService from '../../../../service/NotesService';
import * as ROUTES from '../../../../constants/routes';

import style from '../style.module.scss';

const propTypes = {
  cnt: PropTypes.number, // for watch page to reset selected note
  wholePage: PropTypes.bool, // if it's a note page
};
/*
 * XXX TODO:
 * add loading state for note detail when select a note
 * error handler for NoteLister and NoteDetail
 * cache selected note after .get is called
 * NoteDetail need to alert unsaved change
 * NoteDetail need to show save success or fail state
 * After add a note, can add returned note to this.state.notes, no need to call list
 */
class NoteBoard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      notes: [],
      filtered: false,
      selectedNote: null,
      savingNote: false,
      noteIdToDelete: null,
      searchKey: '',
      error: null,
      loading: true,
    };
    this.saveTimer = null;
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    const { cnt } = this.props;
    if (prevProps && prevProps.cnt !== cnt && cnt > 0) {
      this.setState({
        selectedNote: null,
      });
    }
  }

  handleError = (e) => {
    console.error(e);
    this.setState({
      error: e.message === 'no row updated' ? null : e.message,
      loading: false,
      savingNote: false,
    });
  };

  async initialize() {
    await this.fetchNotes();
    if (this.props.wholePage) {
      const { id } = parseSearchParams(this.props.history.location.search);
      if (id != null) {
        await this.handleSelectNote(id);
      }
    }
  }

  async fetchNotes() {
    try {
      const { searchKey } = this.state;
      let notes;
      let filtered = false;
      if (searchKey) {
        notes = await notesService.search(searchKey);
        filtered = true;
      } else {
        notes = await notesService.list();
      }
      notes.reverse(); // last notes on top
      this.setState({
        notes,
        filtered,
        error: null,
        loading: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  handleSelectNote = async (notes_id) => {
    try {
      if (this.state.selectedNote && this.state.selectedNote.notes_id === notes_id) {
        return;
      }
      if (this.props.wholePage) {
        this.props.history.push(`${ROUTES.COURSE_NOTE}?id=${notes_id}`);
      }
      const selectedNote = await notesService.getNoteById(notes_id);
      if (selectedNote == null) {
        console.error(`get note ${notes_id} failed`);
        throw new Error('Selected note cannot be retrieved');
      } else {
        this.setState({
          selectedNote,
          savingNote: false,
          error: null,
        });
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  handleUnSelectNote = () => {
    this.setState({
      selectedNote: null,
      savingNote: false,
      error: null,
    });
    if (this.props.wholePage) {
      this.props.history.push(ROUTES.COURSE_NOTE);
    }
  };

  handleChangeSelectedNote = (notes_id, key, value, delay) => {
    const currentValue = this.state.selectedNote[key];
    if (currentValue === value) {
      return; // no change
    }
    
    const selectedNote = {
      ...this.state.selectedNote,
      [key]: value,
    };

    const { notes } = this.state;
    if (key === 'title') {
      for (let note of notes) {
        if (note.notes_id === notes_id) {
          note.title = value;
          break;
        }
      }
    }
    this.setState({
      selectedNote,
      notes: [...notes],
      error: null,
    });

    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(
      () => {
        this.saveNoteChange(selectedNote);
      },
      delay ? 1000 : 0,
    );
  };

  saveNoteChange = async (note) => {
    try {
      this.setState({
        savingNote: true,
        error: null,
      });
      await notesService.update(note);
      this.setState({
        savingNote: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleAddNote = async () => {
    try {
      const title = 'New Note';
      const notes = '';
      const newNote = await notesService.add(title, notes);
      this.setState({
        notes: [newNote, ...this.state.notes],
        selectedNote: newNote,
        savingNote: false,
        error: null,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  setNoteToDelete = (noteId) => {
    this.setState({
      noteIdToDelete: noteId,
      error: null,
    });
  };

  handleDeleteNote = (noteId) => {
    let selectedNote = this.state.selectedNote;
    if (selectedNote && selectedNote.notes_id === noteId) {
      selectedNote = null;
    }
    this.setState({
      noteIdToDelete: null,
      selectedNote,
      error: null,
    });
    this.fetchNotes();
  };

  handleChangeSearchKey = (event) => {
    this.setState({
      searchKey: event.target.value,
      error: null,
    });
  };

  handleSearchNote = (event) => {
    if (event.keyCode === 13) {
      this.fetchNotes();
    }
  };

  render() {
    const { notes, filtered, selectedNote, searchKey, error, loading, savingNote } = this.state;
    const { wholePage } = this.props;
    if (loading) {
      return <div className="text-white text-center">Loading...</div>;
    }
    return (
      <div className={style.container}>
        <ErrorDialog error={error} />
        {!selectedNote && (
          <div>
            <div className={style.noteSearch}>
              <Form.Control
                placeholder="Search notes"
                value={searchKey}
                onChange={this.handleChangeSearchKey}
                onKeyDown={this.handleSearchNote}
              />
              <Tooltip title="Add new note">
                <PlusSquareFill
                  size={30}
                  className="p-0 App-clickable icon-btn-primary"
                  onClick={this.handleAddNote}
                />
              </Tooltip>
            </div>
            <NoteList
              notes={notes}
              filtered={filtered}
              selectedNote={selectedNote}
              wholePage={wholePage}
              onSelect={this.handleSelectNote}
              onDelete={this.setNoteToDelete}
            />
          </div>
        )}
        {selectedNote && (
          <NoteDetail
            note={selectedNote}
            wholePage={wholePage}
            saving={savingNote}
            onBack={this.handleUnSelectNote}
            onChange={this.handleChangeSelectedNote}
            onDelete={this.setNoteToDelete}
          />
        )}
        <DeleteNoteModal
          noteId={this.state.noteIdToDelete}
          onSubmit={this.handleDeleteNote}
          onClose={() => this.setNoteToDelete(null)}
        />
      </div>
    );
  }
}

NoteBoard.propTypes = propTypes;

export default withRouter(NoteBoard);
