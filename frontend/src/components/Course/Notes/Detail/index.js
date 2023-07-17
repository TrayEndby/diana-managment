import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import FormControl from 'react-bootstrap/FormControl';
import { Plus, Trash } from 'react-bootstrap-icons';

import TagsSection from '../Tags';

import BackButton from 'util/BackButton';
import authService from 'service/AuthService';
import userProfileSearchService from 'service/UserProfileSearchService';

const propTypes = {
  note: PropTypes.object.isRequired,
  wholePage: PropTypes.bool,
  saving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const NoteDetail = ({ note, wholePage, saving, onBack, onChange, onDelete }) => {
  const history = useHistory();
  const [sharedUser, setSharedUser] = useState('other user');
  const emptyNote = note == null;
  const { user_id, notes_id, title, notes, updated_ts, tags, course_url } = note || {};
  const shared = user_id && user_id !== authService.getUID();

  useEffect(() => {
    if (shared) {
      userProfileSearchService.fetchPublicProfile(user_id).then((res) => {
        const { firstName, lastName } = res;
        if (firstName && lastName) {
          setSharedUser(`${firstName} ${lastName}`);
        }
      });
    }
  }, [shared, user_id]);

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex flex-row align-items-center">
        {wholePage && (
          <BackButton className="mr-3" onClick={onBack} />
        )}
        {updated_ts && (
          <div className="text-center">{`Last update: ${moment(note.updated_ts).format('YYYY-MM-DD')}`}</div>
        )}
        {saving && <div className="ml-2">Saving...</div>}
        {!shared && <Trash className="App-clickable ml-auto" disabled={emptyNote} onClick={() => onDelete(notes_id)} />}
      </div>
      {emptyNote ? (
        'No note selected'
      ) : (
        <>
          {shared && <div className="my-1">Shared by {sharedUser}</div>}
          <TagsSection shared={shared} tags={tags} onChange={(newTags) => onChange(notes_id, 'tags', newTags)} />
          <FormControl
            className="w-100 p-1 mb-1"
            disabled={shared}
            value={title}
            onChange={shared ? null : (e) => onChange(notes_id, 'title', e.target.value, true)}
          />
          <FormControl
            as="textarea"
            style={{ minHeight: '100px' }}
            className="col w-100 my-2"
            disabled={shared}
            value={notes}
            onChange={shared ? null : (e) => onChange(notes_id, 'notes', e.target.value, true)}
          />
          <div className="d-flex flex-row  flex-wrap align-items-center my-2 ">
            {course_url && <div className="mr-2">Course url:</div>}
            {course_url && (
              <div style={wholePage ? null : { width: '200px' }} className="mr-2 App-textOverflow">
                <Link to={course_url}>{course_url}</Link>
              </div>
            )}
            {!shared && !wholePage && (
              <div
                className="d-flex align-items-center App-clickable"
                onClick={() =>
                  onChange(notes_id, 'course_url', `${history.location.pathname}${history.location.search}`)
                }
              >
                <Plus />
                Add current course's link
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

NoteDetail.propTypes = propTypes;

export default NoteDetail;
