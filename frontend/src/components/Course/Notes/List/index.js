import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ShareModal } from '../Share';
import DocItemList from 'util/DocItemList';
import authService from 'service/AuthService';

const propTypes = {
  notes: PropTypes.array.isRequired,
  filtered: PropTypes.bool.isRequired,
  wholePage: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const NoteList = ({ notes, filtered, wholePage, onSelect, onDelete }) => {
  const [noteToShare, setNoteToShare] = useState(null);
  const authId = authService.getUID();

  const items = notes.map(({ notes_id, title, updated_ts, user_id }) => {
    return {
      id: notes_id,
      title,
      updated_ts,
      shared: user_id && user_id !== authId,
    };
  });

  return (
    <>
      <DocItemList
        label="notes"
        items={items}
        filtered={filtered}
        wholePage={wholePage}
        onShare={setNoteToShare}
        onSelect={onSelect}
        onDelete={onDelete}
      />
      {noteToShare && <ShareModal noteId={noteToShare} onClose={() => setNoteToShare(null)} />}
    </>
  );
};

NoteList.propTypes = propTypes;

export default NoteList;
